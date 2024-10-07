using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("home")]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "HTML", "home.html"), "text/html");
        }

    }

}
