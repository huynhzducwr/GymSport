namespace GymSport.DTOs.UserDTOs
{
    public class CreateUserResponseDTO
    {
        public int UserID { get; set; }
        public string Message {  get; set; }
        public bool IsCreated {  get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
