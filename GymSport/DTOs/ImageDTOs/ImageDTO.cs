using System.ComponentModel.DataAnnotations;

namespace GymSport.DTOs.ImageDTOs
{
    public class ImageDTO
    {

        public int ImageID {  get; set; }

        public int ProductID { get; set; }

        public string ImageURL {  get; set; }
    }
}
