using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ColorDTOs
{
    public class UpdateColorDTO
    {
        [Required]
        public int ColorID { get; set; }
        [Required]
        public string ColorName { get; set; }
    }
}
