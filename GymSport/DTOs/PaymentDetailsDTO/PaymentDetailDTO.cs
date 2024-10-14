namespace GymSport.DTOs.PaymentDetailsDTO
{
    public class PaymentDetailDTO
    {
        public int PaymentPaymentDetailID { get; set; }
        public int PaymentID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public Decimal Price { get; set; }
    }
}
