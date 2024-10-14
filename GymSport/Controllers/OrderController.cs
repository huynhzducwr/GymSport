using Microsoft.AspNetCore.Mvc;
using GymSport.DTOs.OrderDTOs;
using GymSport.Repository;
using System.Threading.Tasks;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderRepository _orderRepository;

        public OrderController(OrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO orderDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                Console.Error.WriteLine($"Model State Errors: {string.Join(", ", errors)}"); // Ghi lại các lỗi
                
                return BadRequest(ModelState); // Trả về lỗi trạng thái mô hình nếu kiểm tra thất bại
            }


            try
            {
                var response = await _orderRepository.CreateOrderAsync(orderDto);
                if (response.IsSuccess)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response.Message); // Return the message in case of failure
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error creating order: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred while processing your request."); // Return 500 status with a message
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                // Gọi phương thức để lấy tất cả hình ảnh
                var images = await _orderRepository.GetAllOrders();
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

