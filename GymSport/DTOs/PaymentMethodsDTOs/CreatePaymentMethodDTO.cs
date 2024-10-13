using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.PaymentMethodsDTOs
{
    public class CreatePaymentMethodDTO
    {
        [Required]
        public string PaymentMethodName { get; set; }

    }
}
