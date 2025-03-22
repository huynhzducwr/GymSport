using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {// ===== TEMPLATE METHOD PATTERN =====
        // Template Method Pattern định nghĩa khung của một thuật toán trong một phương thức,
        // hoãn một số bước cho các lớp con. Mẫu này cho phép lớp con định nghĩa lại
        // một số bước của thuật toán mà không thay đổi cấu trúc của nó.

        // Đây là phương thức template định nghĩa các bước cơ bản để phục vụ file HTML
        protected virtual IActionResult GetHtmlFile(string folderPath, string fileName)
        {
            // Bước 1: Xác thực quyền truy cập (có thể override trong lớp con)
            if (!ValidateAccess())
            {
                return Unauthorized("Không có quyền truy cập");
            }

            // Bước 2: Xây dựng đường dẫn đầy đủ
            string fullPath = BuildFilePath(folderPath, fileName);

            // Bước 3: Kiểm tra file tồn tại
            if (!FileExists(fullPath))
            {
                return NotFound($"Không tìm thấy file: {fileName}");
            }

            // Bước 4: Trả về file
            return ServeFile(fullPath);
        }

        // Các phương thức "hook" có thể được override trong lớp kế thừa
        // Hook 1: Kiểm tra quyền truy cập
        protected virtual bool ValidateAccess()
        {
            // Mặc định cho phép truy cập
            // Trong thực tế, bạn có thể kiểm tra quyền người dùng ở đây
            return true;
        }

        // Hook 2: Xây dựng đường dẫn file
        protected virtual string BuildFilePath(string folderPath, string fileName)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath, fileName);
        }

        // Hook 3: Kiểm tra file tồn tại
        protected virtual bool FileExists(string path)
        {
            return System.IO.File.Exists(path);
        }

        // Hook 4: Phục vụ file với loại MIME phù hợp
        protected virtual IActionResult ServeFile(string path)
        {
            // Xác định loại MIME dựa trên phần mở rộng
            string extension = Path.GetExtension(path).ToLowerInvariant();
            string contentType = extension switch
            {
                ".html" => "text/html",
                ".css" => "text/css",
                ".js" => "application/javascript",
                ".json" => "application/json",
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                _ => "application/octet-stream"
            };

            return PhysicalFile(path, contentType);
        }

        // Sử dụng template method trong các action
        [HttpGet]
        public IActionResult Index()
        {
            // Sử dụng template method để phục vụ file admin.html
            return GetHtmlFile("admin_frontend", "admin.html");
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            return GetHtmlFile("admin_frontend/pages", "dashboard.html");
        }

        [HttpGet("products")]
        public IActionResult Products()
        {
            return GetHtmlFile("admin_frontend/pages", "products.html");
        }

        // LỢI ÍCH:
        // 1. Tái sử dụng code: Các controller khác có thể kế thừa và sử dụng lại logic
        // 2. Mở rộng dễ dàng: Có thể override các phương thức con để thay đổi hành vi
        // 3. Nhất quán: Đảm bảo các bước xử lý file được thực hiện theo cùng một quy trình
        // 4. Bảo trì dễ dàng: Thay đổi quy trình chỉ cần sửa ở một nơi
    }


}
