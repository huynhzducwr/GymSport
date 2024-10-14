using GymSport.DTOs.InventoryDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymSport.Repository;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly InventoryRepository _imageRepository;

        public InventoryController(InventoryRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> CreateInventory([FromBody] CreateInventoryDTO uploadImageDTO)
        {
            if (ModelState.IsValid)
            {
                var response = await _imageRepository.CreateInventoryAsync(uploadImageDTO);
                return Ok(response);
            }

            return BadRequest(ModelState);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllInventory()
        {
            try
            {
                // Gọi phương thức để lấy tất cả hình ảnh
                var images = await _imageRepository.GetAllInventoryAsync();

                // Trả về kết quả
                return Ok(images);
            }
            catch (Exception ex)
            {
                // Trả về lỗi nếu có
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("{imageID}")]
        public async Task<IActionResult> DeleteInventory(int imageID)
        {
            try
            {
                // Call the method to delete the image
                var response = await _imageRepository.DeleteInventoryAsync(imageID);

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
