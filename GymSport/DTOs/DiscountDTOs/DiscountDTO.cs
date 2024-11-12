namespace GymSport.DTOs.DiscountDTOs
{
    public class DiscountDTO
    {
        public int DiscountID { get; set; }
        public decimal DiscountPercent { get; set; }
        public string Description { get; set; }
        public bool isActive {  get; set; }
        public DateTime CreateAt { get; set; }
    }
}
