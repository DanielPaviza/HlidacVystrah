using hlidacVystrah.Model;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IMailService
    {
        bool SendRegistrationMail(string email, string activationToken);

    }
}
