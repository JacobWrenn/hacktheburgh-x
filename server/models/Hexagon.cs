using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Models;

public class Hexagon {
    // 15202
    [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
    public ObjectId Id { get; set; }

    public int h3Index { get; set; }

    public ObjectId? ClanId { get; set; }

    public DateTime? ControlDate { get; set; }
}