using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using GymSport.DTOs.ImageDTOs;
using GymSport.Repository;

[ApiController]
[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    private readonly ImageRepository _imageRepository;

    public ImageController(ImageRepository imageRepository)
    {
        _imageRepository = imageRepository;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage([FromForm] UploadImageDTO uploadImageDTO)
    {
        if (ModelState.IsValid)
        {
            var response = await _imageRepository.UploadImageForProductAsync(uploadImageDTO);
            return Ok(response);
        }

        return BadRequest(ModelState);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllImages()
    {
        try
        {
            // Gọi phương thức để lấy tất cả hình ảnh
            var images = await _imageRepository.GetAllImagesAsync();

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
    public async Task<IActionResult> DeleteImage(int imageID)
    {
        try
        {
            // Call the method to delete the image
            var response = await _imageRepository.DeleteImageAsync(imageID);

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
