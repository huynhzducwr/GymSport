using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.UserDTOs
{
    public class UserRoleDTO
    {

        [Required(ErrorMessage ="UserID is required")]
        public int UserID { get; set; }

        [Required(ErrorMessage ="Role ID is required")]
        public int RoleID { get; set; }

    }
}
