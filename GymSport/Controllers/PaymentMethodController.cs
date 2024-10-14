using GymSport.DTOs.PaymentMethodsDTOs;
using GymSport.DTOs.ProductCategoryDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly PaymentMethodRepository _productCategoryRepository; //tao 2 file readonly repository va logger chac de kieu doc tien do
        private readonly ILogger<PaymentMethodController> _logger;


        public PaymentMethodController(PaymentMethodRepository productCategoryRepository, ILogger<PaymentMethodController> logger) // tao constructor
                                                                                                                                         //truyen hai bien tham so repository va logger vua khai bao o tren de ke thua tu class khac
        {
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpPost("AddPaymentMethod")]
        public async Task<APIResponse<CreatePaymentMethodResponseDTO>> CreatePaymentMethod([FromBody] CreatePaymentMethodDTO request)
        {
            _logger.LogInformation("Request Received for CreateProductCategory: {@CreateProductCategoryDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request from body");
                return new APIResponse<CreatePaymentMethodResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the request body");
            }

            try
            {
                var response = await _productCategoryRepository.CreatePaymentMethod(request);  //goi tham chieu den ham createproductecategory tu repository
                _logger.LogInformation("CreatePaymentMethod Response from repository: {@CreatePaymentMethodResponseDTO}", response);
                if (response.isCreated)
                {
                    return new APIResponse<CreatePaymentMethodResponseDTO>(response, response.Message);

                }
                return new APIResponse<CreatePaymentMethodResponseDTO>(HttpStatusCode.BadRequest, response.Message);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new ProductCategory with name {PaymentMethodName}", request.PaymentMethodName);
                return new APIResponse<CreatePaymentMethodResponseDTO>(HttpStatusCode.InternalServerError, "Tao product categoryname failed", ex.Message);
            }
        }

        [HttpGet("GetAllPaymentMethod")]
        public async Task<APIResponse<List<PaymentMethodDTO>>> GetAllPaymentMethod(bool? IsActive = null)
        {
            _logger.LogInformation($"Request recevied to all productCategoty");
            try
            {
                var productCategory = await _productCategoryRepository.ListAllPaymentMethod(IsActive);
                return new APIResponse<List<PaymentMethodDTO>>(productCategory, "Lay tat ca danh sacu thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<PaymentMethodDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }
    }
}
