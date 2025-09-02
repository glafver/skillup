namespace skillup.server.Services
{
    using MongoDB.Bson;
    using skillup.server.Models;

public interface IUserService
{
    IEnumerable<User> GetAllUsers();
    User GetUserById(ObjectId id);
    void CreateUser(User user);
    void UpdateUser(ObjectId id, User user);
    void DeleteUser(ObjectId id);
}
}