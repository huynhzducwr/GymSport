using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.DiscountDTOs
{
    public class CreateDiscountDTO
    {
        [Required]
        public decimal DiscountPercent { get; set; }
        [Required]
        public string Description { get; set; }

       
    }
}
