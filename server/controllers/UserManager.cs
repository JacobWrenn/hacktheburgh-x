using BC = BCrypt.Net.BCrypt;

using Models;

using MongoDB.Driver;

namespace Controllers;

public class UserManager(IMongoDatabase db) {
  private readonly IMongoCollection<User> _users = db.GetCollection<User>("users");

  public async Task<bool> AddUser(User tempUser) {
    var users = await _users.Find(user => user.Username == tempUser.Username).FirstOrDefaultAsync();
    if (users != null) {
      return false;
    }
    var passwordHash = BC.HashPassword(tempUser.Password);
    await _users.InsertOneAsync(new User {
      Id = tempUser.Id,
      Username = tempUser.Username,
      Password = passwordHash
    });
    return true;
  }

  public async Task<bool> AuthenticateUser(User user, HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    if (session.GetInt32("loggedIn") == 1) return true;
    var dbUser = await _users.Find(user => user.Username == user.Username).FirstOrDefaultAsync();
    var result = dbUser != null && BC.Verify(user.Password, dbUser.Password);
    session.SetInt32("loggedIn", result ? 1 : 0);
    session.SetString("username", dbUser!.Username);
    await session.CommitAsync();
    return result;
  }
}