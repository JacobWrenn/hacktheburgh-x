using MongoDB.Bson;

namespace Models;

public class Clan {
    public ObjectId Id { get; set; }

    public string Name { get; set; }
    public string Colour { get; set; }
    public ObjectId LeaderId { get; set; }
}