namespace GymSport.DTOs.OrderDTOs
{
    public class OrderDTO
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string PostalCode { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public string ShippingAddress { get; set; }
        public string PhoneNumber { get; set; }
    }
}
