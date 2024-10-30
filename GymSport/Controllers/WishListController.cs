using GymSport.DTOs.WishListDTOs;
using GymSport.Models;
using GymSport.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishListController : ControllerBase
    {

        private readonly WishListRepository _productCategoryRepository; //tao 2 file readonly repository va logger chac de kieu doc tien do
        private readonly ILogger<WishListController> _logger;


        public WishListController(WishListRepository productCategoryRepository, ILogger<WishListController> logger) // tao constructor
                                                                                                        //truyen hai bien tham so repository va logger vua khai bao o tren de ke thua tu class khac
        {
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpPost("AddWishList")]
        public async Task<APIResponse<CreateWishListDTOResponseDTO>> CreateSize([FromBody] CreateWishListDTO request)
        {
            _logger.LogInformation("Request Received for CreateProductCategory: {@CreateWishListDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request from body");
                return new APIResponse<CreateWishListDTOResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the request body");
            }

            try
            {
                var response = await _productCategoryRepository.CreateWishList(request);  //goi tham chieu den ham createproductecategory tu repository
                _logger.LogInformation("CreateWishList Response from repository: {@CreateWishListResponseDTO}", response);
                if (response.isCreated)
                {
                    return new APIResponse<CreateWishListDTOResponseDTO>(response, response.Message);

                }
                return new APIResponse<CreateWishListDTOResponseDTO>(HttpStatusCode.BadRequest, response.Message);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new Size with name {ProductID}", request.ProductID);
                return new APIResponse<CreateWishListDTOResponseDTO>(HttpStatusCode.InternalServerError, "Tao product categoryname failed", ex.Message);
            }
        }




        [HttpDelete("Delete/{userID}/{productID}")]
        public async Task<APIResponse<DeleteWishListResponseDTO>> deleteWishList(int userID, int productID)
        {
            _logger.LogInformation($"Request Received for deleteSize, userID: {userID}, productID: {productID}");
            try
            {
                // Call the repository method to delete the wishlist item
                var response = await _productCategoryRepository.DeleteWishList(userID, productID);

                // Check if the deletion was successful
                if (response.isDeleted)
                {
                    return new APIResponse<DeleteWishListResponseDTO>(HttpStatusCode.OK, response.Message);
                }
                else
                {
                    // Handle specific status codes returned from the repository
                    if (response.Message.Contains("Sản phẩm không tồn tại trong danh sách yêu thích"))
                    {
                        return new APIResponse<DeleteWishListResponseDTO>(HttpStatusCode.NotFound, response.Message);
                    }
                    return new APIResponse<DeleteWishListResponseDTO>(HttpStatusCode.BadRequest, response.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting wishlist item for user {userID} and product {productID}", userID, productID);
                return new APIResponse<DeleteWishListResponseDTO>(HttpStatusCode.InternalServerError, "Internal error: " + ex.Message);
            }
        }


        [HttpGet("GetAllSize")]
        public async Task<APIResponse<List<WishListDTO>>> GetAllWishList()
        {
            _logger.LogInformation($"Request recevied to all productCategoty");
            try
            {
                var productCategory = await _productCategoryRepository.ListAllWishList();
                return new APIResponse<List<WishListDTO>>(productCategory, "Lay tat ca danh sacu thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<WishListDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }


        //[HttpGet("GetProductCategoryByID")]
        //public async Task<APIResponse<ProductCategoryDTO>> GetProductCategorybyID(int  ID)
        [HttpGet("GetSizeByID")]
        public async Task<APIResponse<WishListDTO>> GetWishListbyID(int ID)
        {
            _logger.LogInformation($"Request received for GetSizeById,ID: {ID}");
            try
            {
                var user = await _productCategoryRepository.GetWishListByIDAsync(ID);
                if (user == null)
                {
                    return new APIResponse<WishListDTO>(HttpStatusCode.NotFound, "Size not found.");

                }
                return new APIResponse<WishListDTO>(user, "Size fetched successfully");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID {SizeID}", ID);
                return new APIResponse<WishListDTO>(HttpStatusCode.InternalServerError, "Error fetching user.", ex.Message);

            }


        }
       
    }
}
