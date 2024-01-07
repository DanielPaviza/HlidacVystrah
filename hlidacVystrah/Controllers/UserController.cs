using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Services;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Model;

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
        public UserRegisterResponse Get([FromBody] RegisterDataDto data)
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
        [HttpPost("resetpassword")]
        public UserResetPasswordResponse Get([FromBody] ResetPasswordDto data)
        {
            return _userService.ResetPassword(data);
        }
    }
}
