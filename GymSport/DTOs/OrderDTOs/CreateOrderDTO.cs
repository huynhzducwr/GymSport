using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.OrderDTOs
{
    public class CreateOrderDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public string ShippingAddress { get; set; }
        [Required]
        public string PhoneNumber {  get; set; }
        [Required]
        public decimal TotalAmount {  get; set; }
        [Required]
        public List<OrderDetailDTO> CartItems { get; set; }

    }
}
