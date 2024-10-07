using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymSport.Repository;
using GymSport.Models;
using GymSport.DTOs.ProductCategoryDTOs;
using System.Net;
using System.Linq.Expressions;
using GymSport.DTOs.UserDTOs;
namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoryController : ControllerBase
    {


        private readonly ProductCategoryRepository _productCategoryRepository; //tao 2 file readonly repository va logger chac de kieu doc tien do
        private readonly ILogger<ProductCategoryController> _logger;


        public ProductCategoryController(ProductCategoryRepository productCategoryRepository, ILogger<ProductCategoryController> logger) // tao constructor
                                                                                                                                         //truyen hai bien tham so repository va logger vua khai bao o tren de ke thua tu class khac
        {
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpPost("AddProductCategory")]
        public async Task<APIResponse<CreateProductCategoryResponseDTO>> CreateProductCategory([FromBody] CreateProductCategoryDTO request)
        {
            _logger.LogInformation("Request Received for CreateProductCategory: {@CreateProductCategoryDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request from body");
                return new APIResponse<CreateProductCategoryResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the request body");
            }

            try
            {
                var response = await _productCategoryRepository.CreateProductCategory(request);  //goi tham chieu den ham createproductecategory tu repository
                _logger.LogInformation("CreateProductCategory Response from repository: {@CreateProductCategoryResponseDTO}", response);
                if (response.isCreated)
                {
                    return new APIResponse<CreateProductCategoryResponseDTO>(response, response.Message);

                }
                return new APIResponse<CreateProductCategoryResponseDTO>(HttpStatusCode.BadRequest, response.Message);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new ProductCategory with name {ProductCategoryName}", request.ProductCategoryName);
                return new APIResponse<CreateProductCategoryResponseDTO>(HttpStatusCode.InternalServerError, "Tao product categoryname failed", ex.Message);
            }
        }

        [HttpPut("Update")]
        public async Task<APIResponse<UpdateProductCategoryResponseDTO>> UpdateUser([FromBody] UpdateProductCategoryDTO updateUserDTO)
        {
            _logger.LogInformation("Request Received for UpdateUser {@UpdateProductCategoryDTO}", updateUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateUser Invalid Request Body");
                return new APIResponse<UpdateProductCategoryResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }

            try
            {
                var response = await _productCategoryRepository.UpdateProductCategory(updateUserDTO);
                if (response.isUpdated)
                {
                    return new APIResponse<UpdateProductCategoryResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateProductCategoryResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserID}", updateUserDTO.ProductCategoryID);
                return new APIResponse<UpdateProductCategoryResponseDTO>(HttpStatusCode.InternalServerError, "Update Failed.", ex.Message);
            }
        }



        [HttpDelete("Delete/{ProductCategoryID}")]
        public async Task<APIResponse<DeleteProductCategoryResponseDTO>> deleteProductCategory(int ProductCategoryID)
        {
            _logger.LogInformation($"Request Received for deleteProductCategory, ProductCategoryID: {ProductCategoryID}");
            try
            {
                // Call the repository method to delete the product category
                var response = await _productCategoryRepository.DeleteProductCategory(ProductCategoryID);

                // Check if the deletion was successful
                if (response.isDeleted)
                {
                    return new APIResponse<DeleteProductCategoryResponseDTO>(HttpStatusCode.OK, response.Message);
                }
                else
                {
                    // Handle specific status codes returned from the repository
                    if (response.Message.Contains("Khong tim thay id productcategory"))
                    {
                        return new APIResponse<DeleteProductCategoryResponseDTO>(HttpStatusCode.NotFound, response.Message);
                    }
                    return new APIResponse<DeleteProductCategoryResponseDTO>(HttpStatusCode.BadRequest, response.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting productCategory {ProductCategoryID}", ProductCategoryID);
                return new APIResponse<DeleteProductCategoryResponseDTO>(HttpStatusCode.InternalServerError, "Internal error: " + ex.Message);
            }
        }



        [HttpGet("GetAllProductCategory")]
        public async Task<APIResponse<List<ProductCategoryDTO>>> GetAllProductCategory(bool? IsActive = null)
        {
            _logger.LogInformation($"Request recevied to all productCategoty");
            try
            {
                var productCategory = await _productCategoryRepository.ListAllProductCategory(IsActive);
                return new APIResponse<List<ProductCategoryDTO>>(productCategory, "Lay tat ca danh sacu thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<ProductCategoryDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }


        //[HttpGet("GetProductCategoryByID")]
        //public async Task<APIResponse<ProductCategoryDTO>> GetProductCategorybyID(int  ID)
        [HttpGet("GetProductCategoryByID")]
        public async Task<APIResponse<ProductCategoryDTO>> GetProductCategorybyID(int ID)
        {
            _logger.LogInformation($"Request received for GetUserById,ID: {ID}");
            try
            {
                var user = await _productCategoryRepository.GetProductCategoryByIDAsync(ID);
                if (user == null)
                {
                    return new APIResponse<ProductCategoryDTO>(HttpStatusCode.NotFound, "User not found.");

                }
                return new APIResponse<ProductCategoryDTO>(user, "User fetched successfully");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID {UserID}", ID);
                return new APIResponse<ProductCategoryDTO>(HttpStatusCode.InternalServerError, "Error fetching user.", ex.Message);

            }


        }
        [HttpPost("ToggleActive")]
        public async Task<IActionResult> ToggleActive([FromQuery] int userId, [FromQuery] bool isActive)
        {
            var result = await _productCategoryRepository.ToggleProductCategoryActiveAsync(userId, isActive);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }


    }
    }
