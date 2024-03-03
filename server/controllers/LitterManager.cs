using Models;

using MongoDB.Driver;

namespace Controllers;

public class LitterManager(IMongoDatabase db) {
    private readonly IMongoCollection<Hexagon> _hexagons = db.GetCollection<Hexagon>("hexagons");
    private readonly IMongoCollection<Clan> _clans = db.GetCollection<Clan>("clans");

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
            hexagonColours[hexagon.h3Index] = hexagon.ClanId?.ToString() ?? "";
        }
        return hexagonColours;
    }

    public async Task<string[]> GetHexagonColours2() {
        var hexagons = await _hexagons.Find(_ => true).ToListAsync();
        string[] hexagonColours = new string[15202];
        
        foreach (var hexagon in hexagons) {
            // Get the colour of the ClanId in control
            if (hexagon.ClanId == null) {
                hexagonColours[hexagon.h3Index] = "#555555";
            } else {
                var clan = await _clans.Find(clan => clan.Id == hexagon.ClanId).FirstOrDefaultAsync();
                hexagonColours[hexagon.h3Index] = clan.Colour;
            }
        }

        return hexagonColours;
    }

    public async Task<bool> SetHexagonColour(HttpContext ctx, int h3Index, Clan userClan) {
        var hexagon = await _hexagons.Find(hexagon => hexagon.h3Index == h3Index).FirstOrDefaultAsync();
        if (hexagon == null) {
            return false;
        }

        var ClanId = userClan?.Id;

        if (ClanId == null) {
            // Sets to unclaimed territory at the moment if the user is not part of a clan
            hexagon.ClanId = null;
            await _hexagons.ReplaceOneAsync(hex => hex.h3Index == h3Index, hexagon);
            return true;
        }

        hexagon.ClanId = ClanId;
        await _hexagons.ReplaceOneAsync(hex => hex.h3Index == h3Index, hexagon);
        return true;
    }
}