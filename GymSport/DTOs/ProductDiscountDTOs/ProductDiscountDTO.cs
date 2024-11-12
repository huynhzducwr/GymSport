using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductDiscountDTOs
{
    public class ProductDiscountDTO
    {
        [Required]
        public int ProductID { get; set; }

        public string ProductName { get; set; }
        [Required]
        public int DiscountID { get; set; }
        [Required]
        public DateTime AppliedDate { get; set; }
    }
}
