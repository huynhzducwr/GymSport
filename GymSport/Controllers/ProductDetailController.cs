using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("productdetail/{id}")]
    [ApiController]
    public class ProductDetailController : ControllerBase
    {
        private readonly ProductsRepository _productService; // Giả sử bạn đã định nghĩa IProductService

        public ProductDetailController(ProductsRepository productService)
        {
            _productService = productService; // Khởi tạo dịch vụ sản phẩm
        }
        [HttpGet]
        public IActionResult Index(int id)
        {
            var product = _productService.GetProductByIdAsync(id);
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "HTML", "productdetail.html"), "text/html");
        }

    }
}
