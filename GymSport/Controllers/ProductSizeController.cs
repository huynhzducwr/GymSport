using GymSport.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using GymSport.Repository;
using GymSport.DTOs.ProductSizeDTOs;
namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductSizeController : ControllerBase
    {
        private readonly ProductSizesRepository _productSizeRepository;
        private readonly ILogger<ProductSizeController> _logger;
        public ProductSizeController(ProductSizesRepository roomAmenityRepository, ILogger<ProductSizeController> logger)
        {
            _productSizeRepository = roomAmenityRepository;
            _logger = logger;
        }
      
        [HttpGet("FetchProductBySizeId/{amenityId}")]
        public async Task<APIResponse<List<FetchProductSizesResponseDTO>>> FetchRoomTypesByAmenityId(int amenityId)
        {
            try
            {
                var roomTypes = await _productSizeRepository.FetchProductSizeBySizeIdAsync(amenityId);
                if (roomTypes != null && roomTypes.Count > 0)
                {
                    return new APIResponse<List<FetchProductSizesResponseDTO>>(roomTypes, "Fetch Product By SizeId Successfully.");
                }
                return new APIResponse<List<FetchProductSizesResponseDTO>>(HttpStatusCode.BadRequest, "No Record Found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Product by amenity ID");
                return new APIResponse<List<FetchProductSizesResponseDTO>>(HttpStatusCode.InternalServerError, "Error fetching product by size ID", ex.Message);
            }
        }
        [HttpPost("AddProductSize")]
        public async Task<APIResponse<ProductSizeResponseDTO>> AddRoomAmenity([FromBody] ProductSizeDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.AddProductSizeAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding room amenity");
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.InternalServerError, "Error adding productsize", ex.Message);
            }
        }
        [HttpPost("DeleteProductSize")]
        public async Task<APIResponse<ProductSizeResponseDTO>> DeleteProductSize([FromBody] ProductSizeDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.DeleteProductSizeAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room amenity");
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.InternalServerError, "Error deleting productSize", ex.Message);
            }
        }
        [HttpPost("BulkInsertRoomAmenities")]
        public async Task<APIResponse<ProductSizeResponseDTO>> BulkInsertRoomAmenities([FromBody] ProductSizeBulkInsertUpdateDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.BulkInsertProductSizeAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing bulk insert of room amenities");
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.InternalServerError, "Error performing bulk insert of productSize", ex.Message);
            }
        }
        [HttpPost("BulkUpdateRoomAmenities")]
        public async Task<APIResponse<ProductSizeResponseDTO>> BulkUpdateRoomAmenities([FromBody] ProductSizeBulkInsertUpdateDTO input)
        {
            try
            {
                var response = await _productSizeRepository.BulkUpdateProductSizeAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing bulk update of product size");
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.InternalServerError, "Error performing bulk update of productSize", ex.Message);
            }
        }
        [HttpPost("DeleteAllProductSizeByProductID/{roomTypeId}")]
        public async Task<APIResponse<ProductSizeResponseDTO>> DeleteAllProductSizeByProductID(int roomTypeId)
        {
            try
            {
                var response = await _productSizeRepository.DeleteAllProductSizeByProductIDAsync(roomTypeId);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductSizeResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting all room amenities by room type ID");
                return new APIResponse<ProductSizeResponseDTO>(HttpStatusCode.InternalServerError, "Error deleting all room amenities by room type ID", ex.Message);
            }
        }
      
    }
}
