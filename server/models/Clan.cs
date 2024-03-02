using MongoDB.Bson;

namespace Models;

public class Clan {
    public ObjectId clanId { get; set; }
    public ObjectId TeamId { get; set; }
    public DateTime ControlDate { get; set; }
}