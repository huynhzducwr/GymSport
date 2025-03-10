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

        // Thêm factory method để tạo response
        private IActionResult CreateResponse(bool isSuccess, object data = null, string message = null, int statusCode = 200)
        {
            var response = new
            {
                isSuccess = isSuccess,
                message = message ?? (isSuccess ? "Operation successful" : "Operation failed"),
                data = data
            };

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
                var response = await _imageRepository.DeleteInventoryAsync(imageID);
                return CreateResponse(
                    response.IsDeleted,
                    null,
                    response.Message,
                    response.IsDeleted ? 200 : 404
                );
            }
            catch (Exception ex)
            {
                return CreateResponse(false, null, $"Internal server error: {ex.Message}", 500);
            }
        }
    }
}
