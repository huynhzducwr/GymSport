using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
namespace GymSport.Controllers
{
    [Route("login")]
    public class LoginController :Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "HTML", "login.html"), "text/html");
        }

    }
}
