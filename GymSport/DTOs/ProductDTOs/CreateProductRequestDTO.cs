using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductDTOs
{
    public class CreateProductRequestDTO
    {
        [Required]
        [StringLength(150, ErrorMessage = "Product name must be up to 150 characters long.")]
        public string ProductName { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Product Category ID.")]
        public int ProductCategoryID { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "Description must be up to 1000 characters long.")]
        public string Description { get; set; }

        [Required]
        [Range(typeof(decimal), "0.01", "999999.99", ErrorMessage = "Price must be between 0.01 and 999999.99.")]
        public decimal Price { get; set; }

        [Required]
        [RegularExpression("(Available|Sold Out)", ErrorMessage = "Status must be 'Available' or 'Sold Out'.")]
        public string Status { get; set; }

        
    }
}
