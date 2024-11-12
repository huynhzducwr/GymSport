using GymSport.DTOs.OrderDTOs;
using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly OrderDetailsRepository _OrderDetailsRepository;

        public OrderDetailsController(OrderDetailsRepository OrderDetailsRepository)
        {
            _OrderDetailsRepository = OrderDetailsRepository;
        }

        
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                // Gọi phương thức để lấy tất cả hình ảnh
                var images = await _OrderDetailsRepository.GetAllOrderDetails();
                // Trả về kết quả
                return Ok(images);
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("details/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderID(int orderId)
        {
            try
            {
                // Gọi phương thức trong repository để lấy chi tiết đơn hàng dựa trên orderId
                var orderDetails = await _OrderDetailsRepository.GetOrderDetailsByOrderID(orderId);

                // Kiểm tra nếu không có chi tiết nào được tìm thấy
                if (orderDetails == null || !orderDetails.Any())
                {
                    return NotFound($"No order details found for order with ID {orderId}");
                }

                // Trả về kết quả nếu có chi tiết đơn hàng
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("{OrderDetailID}")]
        public async Task<IActionResult> DeleteOrderDetail(int OrderDetailID)
        {
            try
            {
                // Call the method to delete the image
                var response = await _OrderDetailsRepository.DeleteOrderDetails(OrderDetailID);

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

    }
}

