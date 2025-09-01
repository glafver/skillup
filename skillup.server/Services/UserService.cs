namespace skillup.server.Services
{
    using skillup.server.Models;
    using MongoDB.Driver;
    using MongoDB.Bson;
    public class UserService : IUserService
    {
        private readonly SkillupDbContext _context;

        public UserService(SkillupDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUserById(ObjectId id)
        {
            return _context.Users.Find(id);
        }
        public void CreateUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }
        public void UpdateUser(ObjectId id, User user)
        {
            var existingUser = _context.Users.Find(id);
            if (existingUser != null)
            {
                existingUser.Username = user.Username;
                existingUser.Email = user.Email;
                existingUser.Password = user.Password;
                _context.SaveChanges();
            }
        }
        public void DeleteUser(ObjectId id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}