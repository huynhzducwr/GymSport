using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace GymSport.Controllers
{

    [Route("thanhtoan")]
    [ApiController]
    public class ThanhtoanController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "HTML", "thanhtoan.html"), "text/html");
        }
    }
}
