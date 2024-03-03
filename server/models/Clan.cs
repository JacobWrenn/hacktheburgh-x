using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Models;

public class Clan {
    [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
    public ObjectId Id { get; set; }

    public string Name { get; set; }
    public string Colour { get; set; }
    public ObjectId? LeaderId { get; set; }
}