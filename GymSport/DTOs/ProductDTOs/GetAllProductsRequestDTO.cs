using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductDTOs
{
    public class GetAllProductsRequestDTO
    {
        // Optional filtering by ProductCategoryID; validation ensures positive integers if provided
        [Range(1, int.MaxValue, ErrorMessage = "Product Category ID must be a positive integer.")]
        public int? ProductCategoryID { get; set; }

        // Optional filtering by Status; uses regex to ensure the status is one of the predefined values
        [RegularExpression("(Available|OutOfStock|Discontinued|All)", ErrorMessage = "Invalid status. Valid statuses are 'Available', 'OutOfStock', 'Discontinued', or 'All' for no filter.")]
        public string? Status { get; set; }
    }
}
