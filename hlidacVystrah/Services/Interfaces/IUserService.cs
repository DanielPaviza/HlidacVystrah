using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IUserService
    {
        BaseResponse Register(RegisterDataDto data);

        UserLoginResponse Login(LoginDataDto data);

        BaseResponse ResetPassword(ResetPasswordDto data);

        BaseResponse ActivateAccount(ActivateAccountDto data);

        BaseResponse SetNewPassword(NewPasswordDto data);
    }
}
