using BC = BCrypt.Net.BCrypt;

using Models;

using MongoDB.Driver;

namespace Controllers;

public class LitterManager(IMongoDatabase db) {
    private readonly IMongoCollection<Hexagon> _hexagons = db.GetCollection<Hexagon>("hexagons");

    // Routes to:
    // Add Hexagons to DB (for setup)
    // Route to retrieve hexagon colours as an array of length 15202

    public async Task<bool> InitHexagons(int NumOfHexagons) {
        int i = 0;
        while (i < NumOfHexagons) {
            await _hexagons.InsertOneAsync(new Hexagon {
                h3Index = i
            });
            i++;
        }
        return true;
    }

    // Route to retrieve hexagon colours as an array of length 15202 from the clan colour
    public async Task<string[]> GetHexagonColours() {
        var hexagons = await _hexagons.Find(_ => true).ToListAsync();
        string[] hexagonColours = new string[15202];
        foreach (var hexagon in hexagons) {
            hexagonColours[hexagon.h3Index] = hexagon.ClanId.ToString();
        }
        return hexagonColours;
    }


    // public async Task<bool> AuthenticateUser(User user, HttpContext ctx) {
    //     var dbUser = await _users.Find(user => user.Username == user.Username).FirstOrDefaultAsync();
    //     var result = dbUser != null && BC.Verify(user.Password, dbUser.Password);
    //     await ctx.Session.LoadAsync();
    //     ctx.Session.SetInt32("loggedIn", result ? 1 : 0);
    //     ctx.Session.SetString("username", dbUser!.Username);
    //     await ctx.Session.CommitAsync();
    //     return result;
    // }
}