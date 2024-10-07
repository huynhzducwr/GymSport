using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("account")]
  
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "HTML", "account.html"), "text/html");
        }
    }
}
