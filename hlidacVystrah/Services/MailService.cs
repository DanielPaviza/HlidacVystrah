
using hlidacVystrah.Model;
using hlidacVystrah.Services.Interfaces;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using hlidacVystrah.Model.Dto;

namespace hlidacVystrah.Services
{

    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        private readonly ILogService _logService;

        public MailService(IOptions<MailSettings> mailSettings, ILogService logService)
        {
            _mailSettings = mailSettings.Value;
            _logService = logService;
            _logService.Service = "MailService";
        }

        private string CreateRegistrationLink(string activationToken)
        {
            string token = Uri.EscapeDataString(activationToken);
            return string.Format("/activateAccount?token={0}", token);
        }        
        
        private string CreatePasswordResetLink(string passwordResetToken)
        {
            string token = Uri.EscapeDataString(passwordResetToken);
            return string.Format("/newpassword?token={0}", token);
        }

        private string GetCurrentDatetime()
        {
            return DateTime.Now.ToString("dd.MM.yyyy HH:mm");
        }

        public bool SendPasswordResetMail(string email, string passwordResetToken)
        {

            string LOG_NAME = $"SendPasswordResetMail - {email}";

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

                    string linkPath = this.CreatePasswordResetLink(passwordResetToken);
                    string timestamp = this.GetCurrentDatetime();
                    emailTemplateText = string.Format(emailTemplateText, _mailSettings.BaseUrl, linkPath, timestamp);

                    emailMessage.Body = this.BuildEmailBody(emailTemplateText);

                    this.SendMail(emailMessage);
                }

                _logService.WriteSuccess("ok", LOG_NAME);

                return true;
            }
            catch (Exception ex)
            {
                this._logService.WriteError(ex.Message, LOG_NAME);
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
            mailClient.Connect(_mailSettings.Server, _mailSettings.Port, true);
            mailClient.Authenticate(_mailSettings.UserName, _mailSettings.Password);
            mailClient.Send(emailMessage);
            mailClient.Disconnect(true);
        }

        private async Task SendMailAsync(MimeMessage emailMessage)
        {
            using SmtpClient mailClient = new SmtpClient();

            await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, true);
            await mailClient.AuthenticateAsync(_mailSettings.UserName, _mailSettings.Password);
            await mailClient.SendAsync(emailMessage);
            await mailClient.DisconnectAsync(true);
        }
        public async Task<bool> SendEventNotificationMailAsync(string email, EventDto eventDetail, string areaName)
        {

            string LOG_NAME = $"SendEventNotificationMailAsync - {email}, Event id: {eventDetail.Id}";

            try
            {
                using (var emailMessage = new MimeMessage())
                {
                    var emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                    emailMessage.From.Add(emailFrom);

                    var emailTo = new MailboxAddress("", email);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = "Výstraha před jevem v " + areaName;

                    string filePath = Directory.GetCurrentDirectory() + "\\MailTemplates\\EventNotification.html";
                    var emailTemplateText = await File.ReadAllTextAsync(filePath);

                    emailTemplateText = string.Format(emailTemplateText, 
                        _mailSettings.BaseUrl,
                        eventDetail.EventType,
                        eventDetail.Severity,
                        eventDetail.Certainty,
                        eventDetail.Urgency,
                        eventDetail.Onset,
                        eventDetail.Expires,
                        eventDetail.Description,
                        eventDetail.Instruction,
                        eventDetail.ImgPath,
                        areaName
                    );

                    emailMessage.Body = BuildEmailBody(emailTemplateText);

                    await SendMailAsync(emailMessage);
                }

                _logService.WriteSuccess("ok", LOG_NAME);

                return true;
            }
            catch (Exception ex)
            {
                this._logService.WriteError(ex.Message, LOG_NAME);
                return false;
            }
        }

        public bool SendRegistrationMail(string email, string activationToken)
        {

            string LOG_NAME = $"SendRegistrationMail - {email}";

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

                    string linkPath = this.CreateRegistrationLink(activationToken);
                    string timestamp = this.GetCurrentDatetime();
                    emailTemplateText = string.Format(emailTemplateText, _mailSettings.BaseUrl, linkPath, timestamp);

                    emailMessage.Body = this.BuildEmailBody(emailTemplateText);

                    this.SendMail(emailMessage); 
                }

                _logService.WriteSuccess("ok", LOG_NAME);

                return true;
            }
            catch (Exception ex)
            {
                this._logService.WriteError(ex.Message, LOG_NAME);
                return false;
            }
        }
    }
}