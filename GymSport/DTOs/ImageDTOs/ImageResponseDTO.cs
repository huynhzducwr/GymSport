using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ImageDTOs
{
    public class ImageResponseDTO
    {
        [Required]
        public int ImageID { get; set; }

        [Required]
        public int ProductID { get; set; }

        [Required]
        public string ImageURL { get; set; } // Use string for the image URL

        public string ProductName { get; set; }
    }
}