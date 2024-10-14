using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.OrderDTOs
{
    public class OrderDetailDTO
    {

        [Required]
        public int ProductID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }  

        public string ImageURL { get; set; }  // Tùy chọn
        public string ProductCategory { get; set; }  // Tùy chọn
        public string ProductColor { get; set; }  // Tùy chọn
        public string ProductName { get; set; }  // Tùy chọn
        public string ProductSize { get; set; }  // Tùy chọn
    }
}
