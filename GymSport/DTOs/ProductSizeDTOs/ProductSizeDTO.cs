using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductSizeDTOs
{
    public class ProductSizeDTO
    {

        [Required]
        public int ProductID { get; set; }

 public string ProductName { get; set; }
        [Required]
        public int SizeID { get; set; }
        public string SizeName { get; set; }

    }
}
