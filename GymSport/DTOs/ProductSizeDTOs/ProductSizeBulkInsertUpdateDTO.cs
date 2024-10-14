using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductSizeDTOs
{
    public class ProductSizeBulkInsertUpdateDTO
    {
        [Required]
        public int ProductID { get; set; }
        [Required]
        public List<int> SizeIDs { get; set; }
    }
}
