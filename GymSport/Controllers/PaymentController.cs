using Microsoft.AspNetCore.Mvc;
using GymSport.DTOs.PaymentDTOs;
using GymSport.Repository;
using System.Threading.Tasks;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentRepository _paymentRepository;

        public PaymentController(PaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDTO paymentDto)
        {
            if (paymentDto == null)
            {
                return BadRequest("Payment data is required.");
            }

            // Execute payment creation
            var response = await _paymentRepository.CreatePaymentAsync(paymentDto);

            if (response.isCreated)
            {
                return Ok(response); // Return 200 OK with the response information
            }
            else
            {
                return BadRequest(response.Message); // Return 400 Bad Request with the error message
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllpayment()
        {
            try
            {
                // Gọi phương thức để lấy tất cả hình ảnh
                var images = await _paymentRepository.GetAllpayment();
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
