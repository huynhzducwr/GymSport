using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("hinhanh")]
    [ApiController]
    public class HinhanhController : Controller
    {

        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin_frontend", "pages", "ui-features", "hinhanhsanpham.html"), "text/html");
        }
    }
}
