using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IUserService
    {
        BaseResponse Register(EmailPasswordDto data);

        UserLoginResponse Login(EmailPasswordDto data);

        BaseResponse ResetPassword(EmailDto data);

        BaseResponse ActivateAccount(ActivationTokenDto data);

        BaseResponse SetNewPassword(NewPasswordDto data);

        BaseResponse SetNewPasswordLoggedIn(NewPasswordLoggedInDto data);

        UserLoginResponse TokenLogin(LoginTokenDto data);

        BaseResponse DeleteAccount(LoginTokenDto data);

        EventNotificationOptionsResponse GetEventNotificationOptions();

        NotificationResponse GetEventNotifications(LoginTokenDto data);

        BaseResponse NotificationAdd(NotificationAddDto data);

        BaseResponse NotificationDelete(NotificationDeleteDto data);
    }
}
