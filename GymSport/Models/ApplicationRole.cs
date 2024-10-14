using Microsoft.AspNetCore.Identity;

namespace GymSport.Models
{
    public class ApplicationRole : IdentityRole<string>
    {
        // Bạn có thể thêm các thuộc tính bổ sung ở đây nếu cần
        public string RoleDescription { get; set; }
    }
}
