using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace GymSport.Controllers
{
    [Route("themsanpham")]
    [ApiController]
    public class themsanphamController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin_frontend", "pages", "forms", "themsanpham.html"), "text/html");
        }
    }
}
