

namespace GymSport.DTOs.WishListDTOs
{
    public class WishListDTO
    {

        public int FavoriteID { get; set; }
        public int UserID { get; set; }

        public int ProductID { get; set; }

        public string ProductName { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public string ProductCategoryName { get; set; }

        public int ImageID { get; set; }
 
        public string ImageURL { get; set; }
    }
}
