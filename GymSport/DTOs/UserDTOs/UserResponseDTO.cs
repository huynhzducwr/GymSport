namespace GymSport.DTOs.UserDTOs
{
    public class UserResponseDTO
    {

        public int UserID { get; set; }
        public string Email {  get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public bool IsActive {  get; set; }
        public DateTime? LastLogin { get; set; }
        public string roleName { get; set; }
    }
}
