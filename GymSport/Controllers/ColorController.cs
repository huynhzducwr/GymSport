using GymSport.DTOs.ColorDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController : ControllerBase
    {

        private readonly ColorRepository _productCategoryRepository; //tao 2 file readonly repository va logger chac de kieu doc tien do
        private readonly ILogger<ColorController> _logger;

        public ColorController(ColorRepository productCategoryRepository, ILogger<ColorController> logger) // tao constructor
                                                                                                        //truyen hai bien tham so repository va logger vua khai bao o tren de ke thua tu class khac
        {
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpPost("AddColor")]
        public async Task<APIResponse<CreateColorResponseDTO>> CreateColor([FromBody] CreateColorDTO request)
        {
            _logger.LogInformation("Request Received for CreateProductCategory: {@CreateColorDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request from body");
                return new APIResponse<CreateColorResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the request body");
            }

            try
            {
                var response = await _productCategoryRepository.CreateColor(request);  //goi tham chieu den ham createproductecategory tu repository
                _logger.LogInformation("CreateColor Response from repository: {@CreateColorResponseDTO}", response);
                if (response.isCreated)
                {
                    return new APIResponse<CreateColorResponseDTO>(response, response.Message);

                }
                return new APIResponse<CreateColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new Size with name {ColorName}", request.ColorName);
                return new APIResponse<CreateColorResponseDTO>(HttpStatusCode.InternalServerError, "Tao colorname failed", ex.Message);
            }
        }



        [HttpPut("Update")]
        public async Task<APIResponse<UpdateColorResponseDTO>> UpdateColor([FromBody] UpdateColorDTO updateUserDTO)
        {
            _logger.LogInformation("Request Received for UpdateColor {@ColorDTO}", updateUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateColor Invalid Request Body");
                return new APIResponse<UpdateColorResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }

            try
            {
                var response = await _productCategoryRepository.UpdateColor(updateUserDTO);
                if (response.isUpdated)
                {
                    return new APIResponse<UpdateColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {ColorID}", updateUserDTO.ColorID);
                return new APIResponse<UpdateColorResponseDTO>(HttpStatusCode.InternalServerError, "Update Failed.", ex.Message);
            }
        }



        [HttpDelete("Delete/{SizeID}")]
        public async Task<APIResponse<DeleteColorResponseDTO>> deleteSize(int SizeID)
        {
            _logger.LogInformation($"Request Received for deleteColor, ColorID: {SizeID}");
            try
            {
                
                var response = await _productCategoryRepository.DeleteColor(SizeID);

                // Check if the deletion was successful
                if (response.isDeleted)
                {
                    return new APIResponse<DeleteColorResponseDTO>(HttpStatusCode.OK, response.Message);
                }
                else
                {
                    // Handle specific status codes returned from the repository
                    if (response.Message.Contains("Khong tim thay id size"))
                    {
                        return new APIResponse<DeleteColorResponseDTO>(HttpStatusCode.NotFound, response.Message);
                    }
                    return new APIResponse<DeleteColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting size {ColorID}", SizeID);
                return new APIResponse<DeleteColorResponseDTO>(HttpStatusCode.InternalServerError, "Internal error: " + ex.Message);
            }
        }



        [HttpGet("GetAllColor")]
        public async Task<APIResponse<List<ColorDTO>>> GetAllColor(bool? IsActive = null)
        {
            _logger.LogInformation($"Request recevied to all Color");
            try
            {
                var productCategory = await _productCategoryRepository.ListAllColor(IsActive);
                return new APIResponse<List<ColorDTO>>(productCategory, "Lay tat ca danh sach thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<ColorDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }

        [HttpGet("GetColorByID")]
        public async Task<APIResponse<ColorDTO>> GetSizebyID(int ID)
        {
            _logger.LogInformation($"Request received for GetColorById,ID: {ID}");
            try
            {
                var user = await _productCategoryRepository.GetColorByIDAsync(ID);
                if (user == null)
                {
                    return new APIResponse<ColorDTO>(HttpStatusCode.NotFound, "Color not found.");

                }
                return new APIResponse<ColorDTO>(user, "Color fetched successfully");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by Color {ColorID}", ID);
                return new APIResponse<ColorDTO>(HttpStatusCode.InternalServerError, "Error fetching user.", ex.Message);

            }


        }
        [HttpPost("ToggleActive")]  
        public async Task<IActionResult> ToggleActive([FromQuery] int userId, [FromQuery] bool isActive)
        {
            var result = await _productCategoryRepository.ToggleColorActiveAsync(userId, isActive);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }

    }
}
