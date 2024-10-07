using System.ComponentModel.DataAnnotations;
namespace GymSport.DTOs.ProductCategoryDTOs
{
    public class CreateProductCategoryDTO
    {
        [Required]
        public string ProductCategoryName { get; set; }
        [Required]
        public string Description {  get; set; }
    }
}
