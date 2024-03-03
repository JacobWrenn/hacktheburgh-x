using Models;

using MongoDB.Bson;

using MongoDB.Driver;

namespace Controllers;

public class ClanRank {
  public int? Rank { get; set; }
  public string? Guild { get; set; }
  public int Points { get; set; }
}

public class ClanManager(IMongoDatabase db) {
  private readonly IMongoCollection<User> _users = db.GetCollection<User>("users");
  private readonly IMongoCollection<Clan> _clans = db.GetCollection<Clan>("clans");
  private readonly IMongoCollection<Event> _events = db.GetCollection<Event>("events");

  public async Task<Clan?> GetClanForUser(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    var user = await _users.Find(user => user.Username == session.GetString("username")).FirstAsync();
    return user.ClanId == null ? null : await _clans.Find(clan => clan.Id == user.ClanId).FirstOrDefaultAsync();
  }

  public async Task CreateClan(HttpContext ctx, Clan clan) {
    var session = ctx.Session;
    await session.LoadAsync();
    var user = await _users.Find(user => user.Username == session.GetString("username")).FirstAsync();
    clan.LeaderId = (ObjectId)user.Id!;
    await _clans.InsertOneAsync(clan);
  }

  // Get the clan points
  public async Task<int> GetClanPoints(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    var user = await _users.Find(user => user.Username == session.GetString("username")).FirstAsync();
    var clan = await _clans.Find(clan => clan.Id == user.ClanId).FirstAsync();

    // Add the points of every member
    var clanPoints = 0;
    var clanMembers = await _users.Find(user => user.ClanId == clan.Id).ToListAsync();
    
    foreach (var member in clanMembers) {
      var events = await _events.Find(e => e.UserId == member.Id).ToListAsync();
      
      foreach (var e in events) {
        clanPoints += e.Points;
      }
    }

    return clanPoints;
  }

  // Generate the clan leaderboard
  // Return [{rank: 1, guild: "Thomases mum", points: 5}, ...]
  public async Task<List<ClanRank>> GetClanLeaderboard(HttpContext ctx) {
    var session = ctx.Session;
    await session.LoadAsync();
    var user = await _users.Find(user => user.Username == session.GetString("username")).FirstAsync();
    var clans = await _clans.Find(_ => true).ToListAsync();

    List<ClanRank> ClanRanks = new List<ClanRank>();

    if (user == null || clans == null) {
      return ClanRanks;
    }

    foreach (var clan in clans) {
      // Add the points of every member
      var clanPoints = 0;
      var clanMembers = await _users.Find(user => user.ClanId == clan.Id).ToListAsync();

      if (clanMembers != null) {
        foreach (var member in clanMembers) {
          var events = await _events.Find(e => e.UserId == member.Id).ToListAsync();
          
          foreach (var e in events) {
            clanPoints += e.Points;
          }
        }
      }

      ClanRanks.Add(new ClanRank{Rank = null, Guild=clan.Name, Points=clanPoints});
    }

    // Sort the array by points
    ClanRanks.Sort((a, b) => b.Points.CompareTo(a.Points));

    // Relabel the ranks
    for (int i = 0; i < ClanRanks.Count; i++) {
      ClanRanks[i].Rank = i + 1;
    }

    // Return JSON array of clan leaderboards
    return ClanRanks;
  }

}