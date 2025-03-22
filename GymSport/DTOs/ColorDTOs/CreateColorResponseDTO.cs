namespace GymSport.DTOs.ColorDTOs
{
    public class CreateColorResponseDTO
    {

        public int ColorID { get; set; }
        public string Message { get; set; }
        public bool isCreated { get; set; }
        public CreateColorResponseDTO Clone()
        {
            return new CreateColorResponseDTO
            {
                ColorID = this.ColorID,
                Message = this.Message,
                isCreated = this.isCreated
            };
        }
    }

}
