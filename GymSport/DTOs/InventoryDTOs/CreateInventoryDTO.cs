using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.InventoryDTOs
{
    public class CreateInventoryDTO
    {

        [Required]
        public int ProductID { get; set; }

        [Required]
        public int StockQuantity { get; set; }
    }
}
