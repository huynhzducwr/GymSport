using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace GymSport.Controllers
{

    [Route("tongsanpham")]
    public class TongsanphamController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin_frontend", "pages", "ui-features", "tongsanpham.html"), "text/html");
        }
    }
}
