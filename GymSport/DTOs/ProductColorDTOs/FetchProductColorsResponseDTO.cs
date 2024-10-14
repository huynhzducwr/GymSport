﻿namespace GymSport.DTOs.ProductColorDTOs
{
    public class FetchProductColorsResponseDTO
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool isActive { get; set; }
        public int ProductCategoryID { get; set; }
    }
}
