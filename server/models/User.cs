using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Models;

public class User {
  public ObjectId Id { get; set; }

  public string Username { get; set; }

  public string PasswordHash { get; set; }

  public ObjectId ClanId { get; set; }

  public GeoJsonPoint<GeoJson2DGeographicCoordinates> HomeLocation { get; set; }
}