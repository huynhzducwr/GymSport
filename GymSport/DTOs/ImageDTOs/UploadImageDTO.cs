using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ImageDTOs
{
    public class UploadImageDTO
    {


        [Required]
        public int ProductID { get; set; }

        public string ProductName { get; set; }
        [Required]
        public IFormFile ImageFile { get; set; } // Tệp hình ảnh
    }
}
