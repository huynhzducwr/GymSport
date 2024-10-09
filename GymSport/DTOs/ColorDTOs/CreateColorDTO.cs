using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ColorDTOs
{
    public class CreateColorDTO
    {
        [Required]
        public string ColorName { get; set; }
    }
}
