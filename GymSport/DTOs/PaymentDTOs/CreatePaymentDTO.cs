using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.PaymentDTOs
{
    public class CreatePaymentDTO
    {
        [Required]
        public int OrderID { get; set; }

        [Required]
        [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "Total amount must be greater than zero.")]
        public decimal TotalAmount { get; set; }

        [Required]
        public int PaymentMethodID { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Payment status cannot exceed 50 characters.")]
        public string PaymentStatus { get; set; }

    }
}
