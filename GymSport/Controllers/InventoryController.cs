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

        // ===== FACTORY METHOD PATTERN =====
        // Factory Method Pattern định nghĩa một interface để tạo đối tượng,
        // nhưng để các lớp con quyết định lớp nào sẽ được khởi tạo.
        // Trong trường hợp này, chúng ta sử dụng một phương thức factory đơn giản
        // để tạo ra các đối tượng response chuẩn hóa.

        // Factory method để tạo response chuẩn hóa
        private IActionResult CreateResponse(bool isSuccess, object? data = null, string? message = null, int statusCode = 200)
        {
            // Tạo đối tượng response với cấu trúc chuẩn
            var response = new
            {
                isSuccess = isSuccess,
                message = message ?? (isSuccess ? "Operation successful" : "Operation failed"),
                data = data
            };

            // Trả về response với status code phù hợp
            return StatusCode(statusCode, response);
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
                var images = await _imageRepository.GetAllInventoryAsync();
                return CreateResponse(true, images, "Retrieved all inventory successfully");
            }
            catch (Exception ex)
            {
                return CreateResponse(false, null, $"Internal server error: {ex.Message}", 500);
            }
        }




        [HttpDelete("{imageID}")]
        public async Task<IActionResult> DeleteInventory(int imageID)
        {
            try
            {
                // Xóa dữ liệu từ repository
                var response = await _imageRepository.DeleteInventoryAsync(imageID);

                // Sử dụng factory method để tạo response phù hợp với kết quả
                return CreateResponse(
                    response.IsDeleted,
                    null,
                    response.Message,
                    response.IsDeleted ? 200 : 404
                );
            }
            catch (Exception ex)
            {
                // Sử dụng factory method để tạo response lỗi
                return CreateResponse(false, null, $"Internal server error: {ex.Message}", 500);
            }
        }

    }
}
