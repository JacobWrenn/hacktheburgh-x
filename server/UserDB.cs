namespace UserDB.DB; 

public record SpecialUser {
    public string Name {get; set;}
    public string Password {get; set;} 
    public int ? Id {get; set;}
}

public class UsersDB {
    private static List<SpecialUser> _users = new List<SpecialUser>() {
        new SpecialUser{ Name="Will", Password="password", Id=0},
        new SpecialUser{ Name="Jacob", Password="password", Id=1}
    };

    public static List<SpecialUser> GetUsers() {
        return _users;
    } 

    public static SpecialUser ? GetUser(int id) {
        return _users.SingleOrDefault(User => User.Id == id);
    } 

    public static SpecialUser CreateUser(SpecialUser user) {
        if (user.Id == null) {
            user.Id = 10;
        }
        _users.Add(user);
        return user;
    }

    public static SpecialUser UpdateUser(SpecialUser update) {
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