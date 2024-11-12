using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductDiscountDTOs
{
    public class ProductDiscountBulkInsertUpdateDTO
    {
        [Required]
        public int ProductID { get; set; }
        [Required]
        public List<int> DiscountIDs { get; set; }
    }
}
