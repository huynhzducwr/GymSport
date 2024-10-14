namespace GymSport.DTOs.OrderDTOs
{
    public class OrderDTO
    {
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public int UserID { get; set; }

        public DateTime? OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public string ShippingAddress { get; set; }
        public string PhoneNumber { get; set; }

    }
}
