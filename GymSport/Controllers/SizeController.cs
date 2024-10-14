using GymSport.DTOs.SizeDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizeController : ControllerBase
    {
    



        private readonly SizeRepository _productCategoryRepository; //tao 2 file readonly repository va logger chac de kieu doc tien do
        private readonly ILogger<SizeController> _logger;


        public SizeController(SizeRepository productCategoryRepository, ILogger<SizeController> logger) // tao constructor
                                                                                                                                         //truyen hai bien tham so repository va logger vua khai bao o tren de ke thua tu class khac
        {
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpPost("AddSize")]
        public async Task<APIResponse<CreateSizeResponseDTO>> CreateSize([FromBody] CreateSizeDTO request)
        {
            _logger.LogInformation("Request Received for CreateProductCategory: {@CreateSizeDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request from body");
                return new APIResponse<CreateSizeResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the request body");
            }

            try
            {
                var response = await _productCategoryRepository.CreateSize(request);  //goi tham chieu den ham createproductecategory tu repository
                _logger.LogInformation("CreateSize Response from repository: {@CreateSizeResponseDTO}", response);
                if (response.isCreated)
                {
                    return new APIResponse<CreateSizeResponseDTO>(response, response.Message);

                }
                return new APIResponse<CreateSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new Size with name {SizeName}", request.SizeName);
                return new APIResponse<CreateSizeResponseDTO>(HttpStatusCode.InternalServerError, "Tao product categoryname failed", ex.Message);
            }
        }

        [HttpPut("Update")]
        public async Task<APIResponse<UpdateSizeResponseDTO>> UpdateSize([FromBody] UpdateSizeDTO updateUserDTO)
        {
            _logger.LogInformation("Request Received for UpdateUser {@SizeDTO}", updateUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateSize Invalid Request Body");
                return new APIResponse<UpdateSizeResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }

            try
            {
                var response = await _productCategoryRepository.UpdateSize(updateUserDTO);
                if (response.isUpdated)
                {
                    return new APIResponse<UpdateSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserID}", updateUserDTO.SizeID);
                return new APIResponse<UpdateSizeResponseDTO>(HttpStatusCode.InternalServerError, "Update Failed.", ex.Message);
            }
        }



        [HttpDelete("Delete/{SizeID}")]
        public async Task<APIResponse<DeleteSizeResponseDTO>> deleteSize(int SizeID)
        {
            _logger.LogInformation($"Request Received for deleteSize, SizeID: {SizeID}");
            try
            {
                // Call the repository method to delete the product category
                var response = await _productCategoryRepository.DeleteSize(SizeID);

                // Check if the deletion was successful
                if (response.isDeleted)
                {
                    return new APIResponse<DeleteSizeResponseDTO>(HttpStatusCode.OK, response.Message);
                }
                else
                {
                    // Handle specific status codes returned from the repository
                    if (response.Message.Contains("Khong tim thay id size"))
                    {
                        return new APIResponse<DeleteSizeResponseDTO>(HttpStatusCode.NotFound, response.Message);
                    }
                    return new APIResponse<DeleteSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting size {SizeID}", SizeID);
                return new APIResponse<DeleteSizeResponseDTO>(HttpStatusCode.InternalServerError, "Internal error: " + ex.Message);
            }
        }



        [HttpGet("GetAllSize")]
        public async Task<APIResponse<List<SizeDTO>>> GetAllSize(bool? IsActive = null)
        {
            _logger.LogInformation($"Request recevied to all productCategoty");
            try
            {
                var productCategory = await _productCategoryRepository.ListAllSize(IsActive);
                return new APIResponse<List<SizeDTO>>(productCategory, "Lay tat ca danh sacu thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<SizeDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }


        //[HttpGet("GetProductCategoryByID")]
        //public async Task<APIResponse<ProductCategoryDTO>> GetProductCategorybyID(int  ID)
        [HttpGet("GetSizeByID")]
        public async Task<APIResponse<SizeDTO>> GetSizebyID(int ID)
        {
            _logger.LogInformation($"Request received for GetSizeById,ID: {ID}");
            try
            {
                var user = await _productCategoryRepository.GetSizeByIDAsync(ID);
                if (user == null)
                {
                    return new APIResponse<SizeDTO>(HttpStatusCode.NotFound, "Size not found.");

                }
                return new APIResponse<SizeDTO>(user, "Size fetched successfully");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID {SizeID}", ID);
                return new APIResponse<SizeDTO>(HttpStatusCode.InternalServerError, "Error fetching user.", ex.Message);

            }


        }
        [HttpPost("ToggleActive")]
        public async Task<IActionResult> ToggleActive([FromQuery] int userId, [FromQuery] bool isActive)
        {
            var result = await _productCategoryRepository.ToggleSizeActiveAsync(userId, isActive);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }
    }
}

