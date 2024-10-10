using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductColorDTOs
{
    public class ProductColorBulkInsertUpdateDTO
    {
        [Required]
        public int ProductID { get; set; }
        [Required]
        public List<int> ColorIDs { get; set; }
    }
}
