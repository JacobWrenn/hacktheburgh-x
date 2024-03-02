using MongoDB.Bson;

namespace Models;

public class Event {
  public ObjectId Id { get; set; }

  public int Points { get; set; }

  public ObjectId UserId { get; set; }
}