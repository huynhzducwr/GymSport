using Microsoft.AspNetCore.Mvc;
using GymSport.DTOs.OrderDTOs;
using GymSport.Repository;
using System.Threading.Tasks;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentdetailController : ControllerBase
    {
        private readonly PaymentdetailRepository _PaymentdetailRepository;

        public PaymentdetailController(PaymentdetailRepository PaymentdetailRepository)
        {
            _PaymentdetailRepository = PaymentdetailRepository;
        }

       
        [HttpGet("all")]
        public async Task<IActionResult> GetAllpaymentdetail()
        {
            try
            {
                // Gọi phương thức để lấy tất cả hình ảnh
                var images = await _PaymentdetailRepository.GetAllpaymentdetail();
                // Trả về kết quả
                return Ok(images);
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
       

    }
}

