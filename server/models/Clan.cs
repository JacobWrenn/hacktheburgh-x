using MongoDB.Bson;

namespace Models;

public class Clan {
    public ObjectId Id { get; set; }

    public ObjectId LeaderId { get; set; }
}