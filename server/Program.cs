using UserDB.DB;


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
