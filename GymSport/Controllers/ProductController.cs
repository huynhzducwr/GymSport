using GymSport.DTOs.ProductCategoryDTOs;
using GymSport.DTOs.ProductDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductsRepository _productRepository;
        private readonly ILogger<ProductController> _logger;

        public ProductController(ProductsRepository productRepository, ILogger<ProductController> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        [HttpGet("All")]
        public async Task<APIResponse<List<ProductDetailResponseDTO>>> GetAllProducts([FromQuery] GetAllProductsRequestDTO request)
        {
            _logger.LogInformation("Request Received for GetAllProducts: {@GetAllProductsRequestDTO}", request);

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid Data in the Request Body");
                return new APIResponse<List<ProductDetailResponseDTO>>(HttpStatusCode.BadRequest, "Invalid Data in the Query String");
            }

            try
            {
                var products = await _productRepository.GetAllProductsAsync(request);
                return new APIResponse<List<ProductDetailResponseDTO>>(products, "Retrieved all products successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all products");
                return new APIResponse<List<ProductDetailResponseDTO>>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<APIResponse<ProductDetailResponseDTO>> GetProductById(int id)
        {
            _logger.LogInformation($"Request Received for GetProductById, id: {id}");
            try
            {
                var response = await _productRepository.GetProductByIdAsync(id);

                if (response == null)
                {
                    return new APIResponse<ProductDetailResponseDTO>(HttpStatusCode.NotFound, "Product ID not found.");
                }

                return new APIResponse<ProductDetailResponseDTO>(response, "Product fetched successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by ID {id}", id);
                return new APIResponse<ProductDetailResponseDTO>(HttpStatusCode.InternalServerError, "Error fetching product.", ex.Message);
            }
        }

        [HttpPost("Create")]
        public async Task<APIResponse<CreateProductResponseDTO>> CreateProduct([FromBody] CreateProductRequestDTO request)
        {
            _logger.LogInformation("Request Received for CreateProduct: {@CreateProductRequestDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid Data in the Request Body");
                return new APIResponse<CreateProductResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
            }

            try
            {
                var response = await _productRepository.CreateProductAsync(request);
                _logger.LogInformation("CreateProduct Response From Repository: {@CreateProductResponseDTO}", response);

                if (response.IsCreated)
                {
                    return new APIResponse<CreateProductResponseDTO>(response, response.Message);
                }
                return new APIResponse<CreateProductResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new product");
                return new APIResponse<CreateProductResponseDTO>(HttpStatusCode.InternalServerError, "Product creation failed.", ex.Message);
            }
        }



        [HttpPut("Update")]
        public async Task<APIResponse<UpdateProductResponseDTO>> UpdateProduct([FromBody] UpdateProductRequestDTO updateUserDTO)
        {
            _logger.LogInformation("Request Received for UpdateUser {@UpdateProductCategoryDTO}", updateUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateUser Invalid Request Body");
                return new APIResponse<UpdateProductResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }

            try
            {
                var response = await _productRepository.UpdateProductAsync(updateUserDTO);
                if (response.IsUpdated)
                {
                    return new APIResponse<UpdateProductResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateProductResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserID}", updateUserDTO.ProductCategoryID);
                return new APIResponse<UpdateProductResponseDTO>(HttpStatusCode.InternalServerError, "Update Failed.", ex.Message);
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<APIResponse<DeleteProductResponseDTO>> DeleteProduct(int id)
        {
            _logger.LogInformation($"Request Received for DeleteProduct, id: {id}");
            try
            {
                var product = await _productRepository.GetProductByIdAsync(id);
                if (product == null)
                {
                    return new APIResponse<DeleteProductResponseDTO>(HttpStatusCode.NotFound, "Product not found.");
                }

                var response = await _productRepository.DeleteProductAsync(id);
                if (response.IsDeleted)
                {
                    return new APIResponse<DeleteProductResponseDTO>(response, response.Message);
                }
                return new APIResponse<DeleteProductResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {id}", id);
                return new APIResponse<DeleteProductResponseDTO>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("ToggleActive")]
        public async Task<IActionResult> ToggleProductActiveAsync([FromQuery] int userId, [FromQuery] bool isActive)
        {
            var result = await _productRepository.ToggleProductActiveAsync(userId, isActive);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }

    }


}

