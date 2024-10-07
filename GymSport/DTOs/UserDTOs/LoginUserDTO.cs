using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.UserDTOs
{
    public class LoginUserDTO
    {
        [Required(ErrorMessage ="Vui long nhap truong email")]
        [EmailAddress(ErrorMessage ="Email khong hop le")]
        public string Email { get; set; }
        [Required(ErrorMessage ="Vui long nhap mat khau")]
        public string Password { get; set; }    



    }
}
