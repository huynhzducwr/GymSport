namespace GymSport.DTOs.FeedBackDTOs
{
    public class FeedbackDTO
    {
        public int FeedbackID { get; set; }
        public int ProductID { get; set; }
        public int UserID { get; set; }
        public string LastName { get; set; }
        public string Comment { get; set; }
        public DateTime FeedbackDate { get; set; }
    }
}
