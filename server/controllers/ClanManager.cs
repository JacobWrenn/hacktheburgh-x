using Models;

using MongoDB.Bson;

using MongoDB.Driver;

namespace Controllers;

public class ClanManager(IMongoDatabase db) {
  private readonly IMongoCollection<User> _users = db.GetCollection<User>("users");
  private readonly IMongoCollection<Clan> _clans = db.GetCollection<Clan>("clans");

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
}