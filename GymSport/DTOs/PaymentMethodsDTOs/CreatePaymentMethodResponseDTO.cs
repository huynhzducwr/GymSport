namespace GymSport.DTOs.PaymentMethodsDTOs
{
    public class CreatePaymentMethodResponseDTO
    {
        public int PaymentMethodID { get; set; }
        public string Message { get; set; }
        public bool isCreated { get; set; }
    }
}
