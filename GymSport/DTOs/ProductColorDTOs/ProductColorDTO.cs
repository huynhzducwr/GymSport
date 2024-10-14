using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ProductColorDTOs
{
    public class ProductColorDTO
    {

        [Required]
        public int ProductID { get; set; }

        public string ProductName { get; set; }
        [Required]
        public int ColorID { get; set; }
        public string ColorName { get; set; }

    }
}
