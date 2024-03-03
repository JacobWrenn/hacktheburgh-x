using BC = BCrypt.Net.BCrypt;

using Models;

using MongoDB.Driver;

using System.Text.Json;

namespace Controllers;

public class Profile {
  public string? Username { get; set; }
  public string? Clan { get; set; }
  public int? Points { get; set; }
}

public class UserManager(IMongoDatabase db) {
  private readonly IMongoCollection<User> _users = db.GetCollection<User>("users");
  private readonly IMongoCollection<Clan> _clans = db.GetCollection<Clan>("clans");

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

  public async Task<string> GetProfile(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    var username = session.GetString("username");

    Profile EmptyProfile = new Profile{Username = "", Clan="", Points=0};
    string EmptyProfileString = JsonSerializer.Serialize(EmptyProfile);

    if (username == null) return EmptyProfileString;
    var user = await _users.Find(user => user.Username == username).FirstOrDefaultAsync();

    // Get user's clan
    var clan = await _clans.Find(clan => clan.Id == user.ClanId).FirstOrDefaultAsync();
    if (clan == null) return EmptyProfileString;

    Profile UserProfile = new Profile{Username = user.Username, Clan=clan.Name, Points=0};

    // Return JSON
    string jsonString = JsonSerializer.Serialize(UserProfile);
    return jsonString;
  }
}