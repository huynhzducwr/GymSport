using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("home")]
    public class HomeController : Controller
    {
        // Dictionary lưu trữ các strategy cho việc trả về file
        private readonly Dictionary<string, Func<string, IActionResult>> _fileStrategies;

        public HomeController()
        {
            _fileStrategies = new Dictionary<string, Func<string, IActionResult>>
            {
                ["html"] = (path) => PhysicalFile(path, "text/html"),
                ["css"] = (path) => PhysicalFile(path, "text/css"),
                ["js"] = (path) => PhysicalFile(path, "application/javascript")
            };
        }
        private IActionResult GetFileResponse(string fileName, string fileType)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fileType, fileName);

            if (_fileStrategies.TryGetValue(fileType, out var strategy))
            {
                return strategy(path);
            }

            return NotFound();
        }

        [HttpGet]
        public IActionResult Index()
        {
            return GetFileResponse("home.html", "html");
        }


    }

}
