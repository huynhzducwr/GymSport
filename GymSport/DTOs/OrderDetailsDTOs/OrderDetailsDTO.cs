namespace GymSport.DTOs.OrderDetailsDTOs
{
    
    public class OrderDetailsDTO
    {
        public int OrderDetailID { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string ImageURL { get; set; }
        public string ProductCategory { get; set; }
        public string ProductColor { get; set; }
        public string ProductSize { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
    }
}
