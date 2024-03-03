using Controllers;

using Models;

using MongoDB.Driver;

using StackExchange.Redis;

var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
if (connectionString == null) {
  Console.WriteLine("You must set your 'MONGODB_URI' environment variable.");
  Environment.Exit(0);
}
var mongoClient = new MongoClient(connectionString);
var mongoDatabase = mongoClient.GetDatabase("SustainabiltyWarriorz");

var userManager = new UserManager(mongoDatabase);
var litterManager = new LitterManager(mongoDatabase);
var clanManager = new ClanManager(mongoDatabase);

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => { });

var redisUrl = Environment.GetEnvironmentVariable("REDIS_URL");
var redisPass = Environment.GetEnvironmentVariable("REDIS_PASS");
if (redisUrl == null || redisPass == null) {
  Console.WriteLine("You must set your 'REDIS_URL' and 'REDIS_PASS' environment variables.");
  Environment.Exit(0);
}
var redisConfigurationOptions = new ConfigurationOptions {
  EndPoints = { { redisUrl } },
  Password = redisPass
};
builder.Services.AddStackExchangeRedisCache(redisCacheConfig => redisCacheConfig.ConfigurationOptions = redisConfigurationOptions);
builder.Services.AddSession(options => {
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});

var app = builder.Build();
app.UsePathBase("/api");

// User Auth Routes
app.MapPost("/user", (User user) => userManager.AddUser(user));
app.MapPost("/user/login", (HttpContext ctx, User user) => userManager.AuthenticateUser(user, ctx));

// User Profile Routes

// Hexagon Routes
app.MapPost("/hexagon/colour", async (HttpContext ctx, int h3Index) => {
    // Get the user's clan
    Clan userClan = await clanManager.GetClanForUser(ctx);
    litterManager.SetHexagonColour(ctx, h3Index, userClan);
});

app.MapGet("/hexagon/colours", () => litterManager.GetHexagonColours());

// Clan Routes
app.MapGet("/clan/points", async (HttpContext ctx) => {
  var ClanPoints = await clanManager.GetClanPoints(ctx);
  return (int) ClanPoints;
});
app.MapGet("/clan/leaderboard", async (HttpContext ctx) => {
  var LeaderboardList = await clanManager.GetClanLeaderboard(ctx);
  return (object) LeaderboardList;
});
app.MapGet("/clan/list", async () => await clanManager.GetClanNames());

app.UseSession();

app.Use(async (ctx, next) => {
  var session = ctx.Session;
  await session.LoadAsync();
  var path = ctx.Request.Path;
  if (path.HasValue) {
    var pathParts = ctx.Request.Path.ToString().Split("/");
    if ((pathParts.Length > 0 && pathParts[1] == "user") || session.GetInt32("loggedIn") == 1) {
      await next.Invoke();
      return;
    }
  }
  ctx.Response.StatusCode = 401;
  await ctx.Response.CompleteAsync();
});

app.Run();
