using hlidacVystrah.Model;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IUserService
    {
        UserRegisterResponse Register(RegisterDataDto data);

        UserLoginResponse Login(LoginDataDto data);

        UserResetPasswordResponse ResetPassword(ResetPasswordDto data);
    }
}
