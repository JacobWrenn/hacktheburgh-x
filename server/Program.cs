using UserDB.DB;
using MongoDB.Driver;
using MongoDB.Bson;

var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
if (connectionString == null)
{
    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
    Environment.Exit(0);
}

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => {});

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapGet("/products", () => "Products");

app.MapGet("/products/{id}", (int id) => id);

app.MapGet("/users/{id}", (int id) => UsersDB.GetUser(id));
app.MapGet("/users", () => UsersDB.GetUsers());
app.MapPost("/users", (User user) => UsersDB.CreateUser(user));

app.Run();
