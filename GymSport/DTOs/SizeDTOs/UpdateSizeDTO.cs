using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.SizeDTOs
{
    public class UpdateSizeDTO
    {
        [Required]
        public int SizeID { get; set; }
        [Required]
        public string SizeName { get; set; }

    }
}
