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


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            try
            {
                // Gọi phương thức trong repository để lấy các đơn hàng của người dùng dựa trên userId
                var orders = await _orderRepository.GetOrdersByUserId(userId);

                // Kiểm tra nếu không có đơn hàng nào được tìm thấy
                if (orders == null || !orders.Any())
                {
                    return NotFound($"No orders found for user with ID {userId}");
                }

                // Trả về kết quả nếu có đơn hàng
                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{OrderID}")]
        public async Task<IActionResult> DeleteOrder(int OrderID)
        {
            try
            {
                // Call the method to delete the image
                var response = await _orderRepository.DeleteOrder(OrderID);

                if (response.IsDeleted)
                {
                    // If deletion was successful, return success JSON response
                    return Ok(new { isSuccess = true, message = response.Message });
                }
                else
                {
                    // If the image does not exist, return not found with error message
                    return NotFound(new { isSuccess = false, message = response.Message });
                }
            }
            catch (Exception ex)
            {
                // Return a JSON error response if there is an exception
                return StatusCode(500, new { isSuccess = false, message = $"Internal server error: {ex.Message}" });
            }
        }
        [HttpPost("ToggleActive")]
        public async Task<IActionResult> ToggleActive([FromQuery] int orderId, [FromQuery] string newStatus)
        {
            var result = await _orderRepository.ToggleOrderStatusActiveAsync(orderId, newStatus);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }


    }
}

