using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.SizeDTOs
{
    public class CreateSizeDTO
    {
        [Required]
        public string SizeName { get; set; }
 
    }
}
