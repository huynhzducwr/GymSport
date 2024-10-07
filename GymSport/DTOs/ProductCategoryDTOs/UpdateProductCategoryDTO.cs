using System.ComponentModel.DataAnnotations;
namespace GymSport.DTOs.ProductCategoryDTOs
{
    public class UpdateProductCategoryDTO
    {
        [Required]
        public int ProductCategoryID { get; set; }
        [Required]
        public string ProductCategoryName { get; set; }
        public string Description { get; set; }


    }
}
