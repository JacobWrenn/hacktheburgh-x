namespace UserDB.DB; 

public record User {
    public string Name {get; set;}
    public string Password {get; set;} 
    public int ? Id {get; set;}
}

public class UsersDB {
    private static List<User> _users = new List<User>() {
        new User{ Name="Will", Password="password", Id=0},
        new User{ Name="Jacob", Password="password", Id=1}
    };

    public static List<User> GetUsers() {
        return _users;
    } 

    public static User ? GetUser(int id) {
        return _users.SingleOrDefault(User => User.Id == id);
    } 

    public static User CreateUser(User user) {
        if (user.Id == null) {
            user.Id = 10;
        }
        _users.Add(user);
        return user;
    }

    public static User UpdateUser(User update) {
        _users = _users.Select(user => {
            if (user.Id == update.Id) {
                user.Name = update.Name;
            }
            
            return user;
        }).ToList();

        return update;
    }

    public static void RemoveUser(int id) {
        _users = _users.FindAll(User => User.Id != id).ToList();
    }
}