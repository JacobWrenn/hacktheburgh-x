using BC = BCrypt.Net.BCrypt;

using Models;

using MongoDB.Driver;

using System.Text.Json;

namespace Controllers;

public class Profile {
  public string? Username { get; set; }
  public string? Clan { get; set; }
  public int Points { get; set; }
  public int? Rank { get; set; }
}

public class UserManager(IMongoDatabase db) {
  private readonly IMongoCollection<User> _users = db.GetCollection<User>("users");
  private readonly IMongoCollection<Clan> _clans = db.GetCollection<Clan>("clans");
  private readonly IMongoCollection<Event> _events = db.GetCollection<Event>("events");

  public async Task<bool> AddUser(User tempUser, HttpContext ctx) {
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
    return await AuthenticateUser(tempUser, ctx);
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

  public async Task<bool> IsLoggedIn(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    return session.GetInt32("loggedIn") == 1;
  }

  public async Task LogOut(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    session.Clear();
    await session.CommitAsync();
  }

  public async Task<string> GetProfile(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    var username = session.GetString("username");

    Profile EmptyProfile = new Profile { Username = "", Clan = "", Points = 0 };
    string EmptyProfileString = JsonSerializer.Serialize(EmptyProfile);

    if (username == null) return EmptyProfileString;
    var user = await _users.Find(user => user.Username == username).FirstOrDefaultAsync();

    // Get user's clan
    var clan = await _clans.Find(clan => clan.Id == user.ClanId).FirstOrDefaultAsync();
    if (clan == null) return EmptyProfileString;

    // Get the user's points
    int UserPoints = 0;
    var events = await _events.Find(e => e.UserId == user.Id).ToListAsync();

    foreach (var e in events) {
      UserPoints += e.Points;
    }

    // Get the user's rank
    var users = await _users.Find(_ => true).ToListAsync();

    List<Profile> Profiles = new List<Profile>();

    foreach (var u in users) {
      int uPoints = 0;
      var uEvents = await _events.Find(e => e.UserId == u.Id).ToListAsync();

      foreach (var e in uEvents) {
        uPoints += e.Points;
      }

      Profiles.Add(new Profile { Username = u.Username, Points = uPoints });
    }

    // Sort the profiles
    Profiles.Sort((a, b) => b.Points.CompareTo(a.Points));

    // Fill in the ranks
    for (int i = 0; i < Profiles.Count; i++) {
      Profiles[i].Rank = i + 1;
    }

    // Find the rank of the user
    int UserRank = 0;
    for (int i = 0; i < Profiles.Count; i++) {
      if (Profiles[i].Username == user.Username) {
        UserRank = Profiles[i].Rank ?? 0;
        break;
      }
    }

    Profile UserProfile = new Profile { Username = user.Username, Clan = clan.Name, Points = UserPoints, Rank = UserRank };

    // Return JSON
    string jsonString = JsonSerializer.Serialize(UserProfile);
    return jsonString;
  }
}