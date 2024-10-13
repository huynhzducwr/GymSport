using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.InventoryDTOs
{
    public class InventoryResponseDTO
    {
        [Required]
        public int ImageID { get; set; }

        [Required]
        public int ProductID { get; set; }

        [Required]
        public int StockQuantity {  get; set; }
        [Required]
        public string ProductName { get; set; }
    }
}
