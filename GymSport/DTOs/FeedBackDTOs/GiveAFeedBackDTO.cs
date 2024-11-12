using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.FeedBackDTOs
{
    public class GiveAFeedBackDTO
    {
        [Required]
        public int ProductID { get; set; }


        [Required]
        public int UserID { get; set; }
        [Required]
        public int Rating {  get; set; }

        //[Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        //public int Rating { get; set; }

        [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string Comment { get; set; }

        public DateTime FeedbackDate { get; set; } = DateTime.Now;
    }
}
