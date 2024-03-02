using Controllers;

using Models;

using MongoDB.Driver;

using UserDB.DB;

var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
if (connectionString == null) {
  Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
  Environment.Exit(0);
}
var mongoClient = new MongoClient(connectionString);
var mongoDatabase = mongoClient.GetDatabase("SustainabiltyWarriorz");

var userManager = new UserManager(mongoDatabase);

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => { });
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
  options.IdleTimeout = TimeSpan.FromSeconds(10);
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

// app.MapGet("/products", () => "Products");
// app.MapGet("/products/{id}", (int id) => id);
// app.MapGet("/users/{id}", (int id) => UsersDB.GetUser(id));
// app.MapGet("/users", () => UsersDB.GetUsers());

app.MapPost("/user", (User user) => userManager.AddUser(user));
app.MapPost("/user/login", (HttpContext ctx, User user) => userManager.AuthenticateUser(user, ctx));

app.UseSession();

app.Run();
