using System.ComponentModel.DataAnnotations;
namespace GymSport.DTOs.UserDTOs
{
    public class UpdateUserDTO
    {
        [Required(ErrorMessage ="Nhap id nguoi dung")]
        public int userID { get; set; }
        [Required(ErrorMessage ="Nhap email")]
        [EmailAddress(ErrorMessage ="Email khong hop le")]
        public string Email { get; set; }
        
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string Password { get; set; }
    }
}
