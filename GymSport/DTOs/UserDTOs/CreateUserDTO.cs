using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
namespace GymSport.DTOs.UserDTOs
{
    public class CreateUserDTO
    {
        [Required(ErrorMessage ="Yeu cau nhap truong Email")]
        [EmailAddress(ErrorMessage="Email khong hop le")]
        public string Email { get; set; }
        [Required(ErrorMessage ="Yeu cau nhap mat khau")]
        public string Password { get; set; }
        [Required(ErrorMessage ="Nhap ho")]
        public string firstName { get; set; }
        [Required(ErrorMessage ="Nhap ten")]
        public string lastName { get; set; }







    }
}
