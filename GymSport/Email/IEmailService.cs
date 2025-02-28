namespace GymSport.Email
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string toEmail, string verificationToken);
    }
}
