namespace GymSport.DTOs.PaymentDTOs
{
    public class CreatePaymentResponseDTO
    {
        public int PaymentID { get; set; }
        public string Message { get; set; }
        public bool isCreated { get; set; }
    }
}
