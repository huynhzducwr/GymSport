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

