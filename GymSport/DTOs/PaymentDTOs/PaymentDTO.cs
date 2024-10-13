namespace GymSport.DTOs.PaymentDTOs
{
    public class PaymentDTO
    {
        public int PaymentID { get; set; } // Unique ID for the payment
        public int OrderID { get; set; } // Associated order ID (integer as per your SQL schema)
        public decimal Amount { get; set; } // Total payment amount (decimal for financial data)
        public decimal TotalAmount { get; set; } // Total amount including shipping
        public int PaymentMethodID { get; set; } // Payment method used for the payment
        public string PaymentStatus { get; set; } // Status of the payment (e.g., 'Pending', 'Paid', 'Failed')

    }
}
