using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("themhinhanh")]
    [ApiController]
    public class ThemhinhanhController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin_frontend", "pages", "ui-features", "themhinhanh.html"), "text/html");
        }
    }
}
