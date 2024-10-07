namespace GymSport.DTOs.ProductDTOs
{
    public class ProductDetailResponseDTO
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool isActive { get; set; }
        public string ProductCategoryName { get; set; }
        public string Status { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
