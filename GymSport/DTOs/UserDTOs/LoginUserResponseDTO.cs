namespace GymSport.DTOs.UserDTOs
{
    public class LoginUserResponseDTO
    {
        public int UserID { get; set; }
        public string Message {  get; set; }
        public int RoleID { get; set; }
        public bool isLogin {  get; set; }
    }
}
