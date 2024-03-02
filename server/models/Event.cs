using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Models;

public class Event {
  [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
  public ObjectId Id { get; set; }

  public int Points { get; set; }

  public ObjectId UserId { get; set; }
}