using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Services;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Model.Dto;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService; 
        }

        // GET api/user/register
        [HttpPost("register")]
        public BaseResponse Get([FromBody] RegisterDataDto data)
        {
            return _userService.Register(data);
        }        
        
        // GET api/user/login
        [HttpPost("login")]
        public UserLoginResponse Get([FromBody] LoginDataDto data)
        {
            return _userService.Login(data);
        }        
        
        // GET api/user/login
        [HttpPost("tokenlogin")]
        public UserLoginResponse Get([FromBody] LoginTokenDto data)
        {
            return _userService.TokenLogin(data);
        }

        // GET api/user/resetpassword
        [HttpPost("resetpassword")]
        public BaseResponse Get([FromBody] ResetPasswordDto data)
        {
            return _userService.ResetPassword(data);
        }

        // GET api/user/activateaccount
        [HttpPost("activateaccount")]
        public BaseResponse Get([FromBody] ActivateAccountDto data)
        {
            return _userService.ActivateAccount(data);
        }        
        
        // GET api/user/newpassword
        [HttpPost("newpassword")]
        public BaseResponse Get([FromBody] NewPasswordDto data)
        {
            return _userService.SetNewPassword(data);
        }  
        
        // GET api/user/newpasswordloggedin
        [HttpPost("newpasswordloggedin")]
        public BaseResponse Get([FromBody] NewPasswordLoggedInDto data)
        {
            return _userService.SetNewPasswordLoggedIn(data);
        }

        // GET api/user/deleteaccount
        [HttpPost("deleteaccount")]
        public BaseResponse Get([FromBody] DeleteAccountDto data)
        {
            return _userService.DeleteAccount(data);
        }
    }
}
