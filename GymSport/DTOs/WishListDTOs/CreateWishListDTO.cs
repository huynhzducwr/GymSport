using System.ComponentModel.DataAnnotations;
namespace GymSport.DTOs.WishListDTOs
{
    public class CreateWishListDTO
    {
        [Required]
        public int UserID { get; set; }
        [Required]
        public int ProductID { get; set;}
        [Required]
        public string ProductName { get; set; }

        [Required]
        public decimal Price { get; set; }
        [Required]
        public string ProductCategoryName { get; set; }
        [Required]
        public int ImageID { get; set; }
        [Required]
        public string ImageURL { get; set; }
    }
}
