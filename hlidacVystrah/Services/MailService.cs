
using hlidacVystrah.Model;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using System.Web;

namespace hlidacVystrah.Services
{

    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
        }

        private string CreateRegistrationLink(string activationToken)
        {
            string token = Uri.EscapeDataString(activationToken);
            return string.Format("https://localhost:44408/activateAccount?token={0}", token);
        }        
        
        private string CreatePasswordResetLink(string passwordResetToken)
        {
            string token = Uri.EscapeDataString(passwordResetToken);
            return string.Format("https://localhost:44408/newpassword?token={0}", token);
        }

        private string GetCurrentDatetime()
        {
            return DateTime.Now.ToString("dd.MM.yyyy HH:mm");
        }

        public bool SendPasswordResetMail(string email, string passwordResetToken)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                    emailMessage.From.Add(emailFrom);

                    MailboxAddress emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = "Zapomenuté heslo";

                    string filePath = Directory.GetCurrentDirectory() + "\\MailTemplates\\PasswordReset.html";
                    string emailTemplateText = File.ReadAllText(filePath);

                    string link = this.CreatePasswordResetLink(passwordResetToken);
                    string timestamp = this.GetCurrentDatetime();
                    emailTemplateText = string.Format(emailTemplateText, link, timestamp);

                    emailMessage.Body = this.BuildEmailBody(emailTemplateText);

                    this.SendMail(emailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
        private MimeEntity BuildEmailBody(string emailTemplateText)
        {
            BodyBuilder emailBodyBuilder = new BodyBuilder();
            emailBodyBuilder.HtmlBody = emailTemplateText;
            emailBodyBuilder.TextBody = "Plain Text goes here to avoid marked as spam for some email servers.";

            return emailBodyBuilder.ToMessageBody();
        }

        private void SendMail(MimeMessage emailMessage)
        {
            using SmtpClient mailClient = new SmtpClient();
            mailClient.Connect(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            mailClient.Authenticate(_mailSettings.UserName, _mailSettings.Password);
            mailClient.Send(emailMessage);
            mailClient.Disconnect(true);
        }

        public bool SendRegistrationMail(string email, string activationToken)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                    emailMessage.From.Add(emailFrom);

                    MailboxAddress emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = "Registrace účtu";

                    string filePath = Directory.GetCurrentDirectory() + "\\MailTemplates\\Register.html";
                    string emailTemplateText = File.ReadAllText(filePath);

                    string link = this.CreateRegistrationLink(activationToken);
                    string timestamp = this.GetCurrentDatetime();
                    emailTemplateText = string.Format(emailTemplateText, link, timestamp);

                    emailMessage.Body = this.BuildEmailBody(emailTemplateText);

                    this.SendMail(emailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}