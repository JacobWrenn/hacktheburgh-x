using Controllers;

using Models;

using MongoDB.Driver;

var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
if (connectionString == null) {
  Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
  Environment.Exit(0);
}
var mongoClient = new MongoClient(connectionString);
var mongoDatabase = mongoClient.GetDatabase("SustainabiltyWarriorz");

var userManager = new UserManager(mongoDatabase);
var litterManager = new LitterManager(mongoDatabase);

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => { });
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
  options.IdleTimeout = TimeSpan.FromSeconds(10);
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});

var app = builder.Build();

app.MapPost("/user", (User user) => userManager.AddUser(user));
app.MapPost("/user/login", (HttpContext ctx, User user) => userManager.AuthenticateUser(user, ctx));

app.MapPost("/hexagon/init", () => litterManager.InitHexagons(15202));

app.UseSession();

app.Use(async (ctx, next) => {
  var session = ctx.Session;
  await session.LoadAsync();
  var pathParts = ctx.Request.Path.ToString().Split("/");
  if ((pathParts.Length > 0 && pathParts[1] == "user") || session.GetInt32("loggedIn") == 1) {
    await next.Invoke();
  }
  else {
    ctx.Response.StatusCode = 401;
    await ctx.Response.CompleteAsync();
  }
});

app.Run();
