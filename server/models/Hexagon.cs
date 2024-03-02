using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;

namespace Models;

public class Hexagon {
    public ObjectId Id { get; set; }

    public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; }

    public ObjectId? ClanId { get; set; }

    public DateTime? ControlDate { get; set; }
}