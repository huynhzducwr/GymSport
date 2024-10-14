using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ImageDTOs
{
    public class UploadImageDTO
    { 
      
    
        [Required]
        public int ProductID { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; } // Tệp hình ảnh
    }
}
