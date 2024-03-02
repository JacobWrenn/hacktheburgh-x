using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Models;

public class User {
  [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
  public ObjectId? Id { get; set; }

  public string Username { get; set; }

  public string Password { get; set; }

  public ObjectId? ClanId { get; set; }

  public GeoJsonPoint<GeoJson2DGeographicCoordinates>? HomeLocation { get; set; }
}