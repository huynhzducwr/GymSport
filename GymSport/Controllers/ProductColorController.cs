using GymSport.DTOs.ProductColorDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductColorController : ControllerBase
    {
        private readonly ProductColorsRepository _productSizeRepository;
        private readonly ILogger<ProductColorController> _logger;
        public ProductColorController(ProductColorsRepository roomAmenityRepository, ILogger<ProductColorController> logger)
        {
            _productSizeRepository = roomAmenityRepository;
            _logger = logger;
        }

        [HttpGet("FetchProductByColorId/{colorID}")]
        public async Task<APIResponse<List<FetchProductColorsResponseDTO>>> FetchProductByColorId(int colorID)
        {
            try
            {
                var roomTypes = await _productSizeRepository.FetchProductColorByColorIdAsync(colorID);
                if (roomTypes != null && roomTypes.Count > 0)
                {
                    return new APIResponse<List<FetchProductColorsResponseDTO>>(roomTypes, "Fetch Product By ColorID Successfully.");
                }
                return new APIResponse<List<FetchProductColorsResponseDTO>>(HttpStatusCode.BadRequest, "No Record Found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Product by color ID");
                return new APIResponse<List<FetchProductColorsResponseDTO>>(HttpStatusCode.InternalServerError, "Error fetching product by color ID", ex.Message);
            }
        }
        [HttpPost("AddProductColor")]
        public async Task<APIResponse<ProductColorResponseDTO>> AddProductColor([FromBody] ProductColorDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.AddProductColorAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding productColor");
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.InternalServerError, "Error adding productcolor", ex.Message);
            }
        }
        [HttpPost("DeleteProductColor")]
        public async Task<APIResponse<ProductColorResponseDTO>> DeleteProductColor([FromBody] ProductColorDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.DeleteProductColorAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room amenity");
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.InternalServerError, "Error deleting productSize", ex.Message);
            }
        }
        [HttpPost("BulkInsertProductColor")]
        public async Task<APIResponse<ProductColorResponseDTO>> BulkInserProductColor([FromBody] ProductColorBulkInsertUpdateDTO input)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Request Body");
                }
                var response = await _productSizeRepository.BulkInsertProductColorAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing bulk insert of room amenities");
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.InternalServerError, "Error performing bulk insert of productSize", ex.Message);
            }
        }
        [HttpPost("BulkUpdateProductColor")]
        public async Task<APIResponse<ProductColorResponseDTO>> BulkUpdateRoomAmenities([FromBody] ProductColorBulkInsertUpdateDTO input)
        {
            try
            {
                var response = await _productSizeRepository.BulkUpdateProductColorAsync(input);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing bulk update of product size");
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.InternalServerError, "Error performing bulk update of productSize", ex.Message);
            }
        }
        [HttpPost("DeleteAllProductColorByProductID/{productId}")]
        public async Task<APIResponse<ProductColorResponseDTO>> DeleteAllProductSizeByProductID(int productId)
        {
            try
            {
                var response = await _productSizeRepository.DeleteAllProductColorByProductIDAsync(productId);
                if (response.IsSuccess)
                {
                    return new APIResponse<ProductColorResponseDTO>(response, response.Message);
                }
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting all room amenities by room type ID");
                return new APIResponse<ProductColorResponseDTO>(HttpStatusCode.InternalServerError, "Error deleting all room amenities by room type ID", ex.Message);
            }
        }

        [HttpGet("GetAllProductColor")]
        public async Task<APIResponse<List<ProductColorDTO>>> GetAllProductColor()
        {
            _logger.LogInformation($"Request recevied to all productSize");
            try
            {
                var productCategory = await _productSizeRepository.ListAllProductColor();
                return new APIResponse<List<ProductColorDTO>>(productCategory, "Lay tat ca danh sach thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<ProductColorDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }
    }
}
