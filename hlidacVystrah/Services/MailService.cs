
using hlidacVystrah.Model;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Configuration;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;

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
            return string.Format("https://localhost:44408/activateAccount/{0}", activationToken);
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
                    string today = DateTime.Today.Date.ToShortDateString();
                    emailTemplateText = string.Format(emailTemplateText, link, today);

                    BodyBuilder emailBodyBuilder = new BodyBuilder();
                    emailBodyBuilder.HtmlBody = emailTemplateText;
                    emailBodyBuilder.TextBody = "Plain Text goes here to avoid marked as spam for some email servers.";

                    emailMessage.Body = emailBodyBuilder.ToMessageBody();

                    using SmtpClient mailClient = new SmtpClient();
                    mailClient.Connect(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                    mailClient.Authenticate(_mailSettings.UserName, _mailSettings.Password);
                    mailClient.Send(emailMessage);
                    mailClient.Disconnect(true);
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