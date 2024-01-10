using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Http;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Security.Cryptography;

namespace hlidacVystrah.Services
{

    public class UserService : MasterService, IUserService
    {

        IMailService _mailService;
        private int passwordMinLength = 6;

        public UserService(AppDbContext context, IMailService mailService) : base(context)
        {
            _context = context;
            _mailService = mailService;
        }

        public BaseResponse ActivateAccount(ActivateAccountDto data)
        {
            UserTable? user = _context.User.FirstOrDefault(u => u.activation_token == data.ActivationToken);
            if (user == null || user.isActive)
                return new BaseResponse { ResponseCode = StatusCodes.Status400BadRequest };

            user.isActive = true;
            _context.SaveChanges();

            return new BaseResponse { ResponseCode = StatusCodes.Status200OK };
        }

        public BaseResponse ResetPassword(ResetPasswordDto data)
        {

            UserTable? user = _context.User.FirstOrDefault(u => u.email == data.Email);
            if(user == null)
                return new BaseResponse { ResponseCode = StatusCodes.Status400BadRequest };

            try
            {
                user.password_reset_token = this.GeneratePasswordResetToken();
                user.password_reset_token_expire = DateTime.Now.AddHours(24);
                _context.SaveChanges();
            } catch (Exception ex)
            {
                return new BaseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            bool emailSent = _mailService.SendPasswordResetMail(user.email, user.password_reset_token);
            if (!emailSent)
                return new BaseResponse { ResponseCode = StatusCodes.Status500InternalServerError };

            return new BaseResponse { ResponseCode = StatusCodes.Status200OK };
        }

        public UserLoginResponse Login(LoginDataDto data)
        {
            UserTable user = _context.User.FirstOrDefault(u => u.email == data.Email);
            if(user == null || user.password != this.HashPassword(data.Password))
                return new UserLoginResponse { ResponseCode = StatusCodes.Status401Unauthorized };

            return new UserLoginResponse { ResponseCode = StatusCodes.Status200OK };
        }

        public BaseResponse Register(RegisterDataDto data) {

            // Return bad request if the email isnt the right format or if the password isnt at least 6 characters long
            if(!this.EmailIsValid(data.Email) || data.Password.Length < passwordMinLength)
                return new BaseResponse { ResponseCode = StatusCodes.Status400BadRequest };

            // Return 409 conflict if the email is already registered
            if (_context.User.Any(user => user.email == data.Email))
                return new BaseResponse { ResponseCode = StatusCodes.Status409Conflict };

            try
            {

                UserTable user = new UserTable
                {
                    email = data.Email,
                    password = this.HashPassword(data.Password),
                    isActive = false,
                    activation_token = this.GenerateActivationToken()
                };

                _context.User.Add(user);

                bool emailSent = _mailService.SendRegistrationMail(user.email, user.activation_token);
                
                if(!emailSent)
                    return new BaseResponse { ResponseCode = StatusCodes.Status500InternalServerError };

                _context.SaveChanges();

            }
            catch (Exception ex)
            {
                return new BaseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new BaseResponse { ResponseCode = StatusCodes.Status200OK };
        }

        private string GenerateActivationToken()
        {
            string token;
            do
            {
                token = this.GenerateToken();
            } while (_context.User.Any(u => u.activation_token == token));

            return token;
        }        
        
        private string GeneratePasswordResetToken()
        {
            string token;
            do
            {
                token = this.GenerateToken();
            } while (_context.User.Any(u => u.password_reset_token == token));

            return token;
        }

        private string GenerateToken(int length = 32)
        {
            byte[] randomBytes = new byte[length];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                // ComputeHash - returns byte array
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convert byte array to a string representation
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2")); // "x2" means hexadecimal format with two characters
                }

                return builder.ToString();
            }
        }

        private bool EmailIsValid(string email) {
            string emailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
            Regex regex = new Regex(emailPattern);

            return regex.IsMatch(email);
        }
    }
}