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
        public string PhoneNumber { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<OrderDetailDTO> CartItems { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string PostalCode { get; set; }
    }
}
