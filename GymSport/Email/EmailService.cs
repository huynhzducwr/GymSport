using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace GymSport.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendVerificationEmail(string toEmail, string verificationToken)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                string smtpServer = emailSettings["SMTPServer"];
                int smtpPort = int.Parse(emailSettings["SMTPPort"]);
                string senderEmail = emailSettings["SenderEmail"];
                string senderPassword = emailSettings["SenderPassword"];

                var smtpClient = new SmtpClient(smtpServer)
                {
                    Port = smtpPort,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true
                };

                string verificationLink = $"https://localhost:44326/home/verify-email?token={verificationToken}";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "GymSport"),
                    Subject = "Xác minh email của bạn",
                    Body = $"Vui lòng nhấp vào link sau để xác minh email: <a href='{verificationLink}'>Xác minh Email</a>",
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Đã gửi email xác minh đến {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi khi gửi email xác minh: {ex.Message}");
            }
        }
    }
}
