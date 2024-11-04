using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;
using GymSport.DTOs.FeedBackDTOs;
using GymSport.Repository;
using Microsoft.Extensions.Logging;
using GymSport.Models;
using GymSport.DTOs.ColorDTOs;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedBackController : ControllerBase
    {
        private readonly FeedBackRepository _feedbackRepository; // Khai báo repository cho Feedback
        private readonly ILogger<FeedBackController> _logger; // Khai báo logger

        public FeedBackController(FeedBackRepository feedbackRepository, ILogger<FeedBackController> logger) // Constructor với tham số repository và logger
        {
            _feedbackRepository = feedbackRepository;
            _logger = logger;
        }
        [HttpPost("AddFeedback")]
        public async Task<APIResponse<GiveAFeedBackResponseDTO>> GiveFeedback([FromBody] GiveAFeedBackDTO request)
        {
            _logger.LogInformation("Request Received for GiveFeedback: {@GiveAFeedBackDTO}", request);

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid request data in body");
                return new APIResponse<GiveAFeedBackResponseDTO>(HttpStatusCode.BadRequest, "Invalid data in request body");
            }

            try
            {
                var response = await _feedbackRepository.GiveFeedback(request); // Gọi phương thức GiveFeedback từ repository
                _logger.LogInformation("GiveFeedback Response from repository: {@GiveAFeedBackResponseDTO}", response);

                if (response.IsSuccess)
                {
                    return new APIResponse<GiveAFeedBackResponseDTO>(response, response.Message);
                }

                return new APIResponse<GiveAFeedBackResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding feedback for ProductID {ProductID} by UserID {UserID}", request.ProductID, request.UserID);
                return new APIResponse<GiveAFeedBackResponseDTO>(HttpStatusCode.InternalServerError, "Failed to add feedback", ex.Message);
            }
        }


        [HttpGet("GetAllFeedBack")]
        public async Task<APIResponse<List<FeedbackDTO>>> GetAllFeedback()
        {
            _logger.LogInformation($"Request recevied to all Color");
            try
            {
                var productCategory = await _feedbackRepository.ListAllFeedbacks();
                return new APIResponse<List<FeedbackDTO>>(productCategory, "Lay tat ca danh sach thanh cong");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error lay danh sach khong thanh cong");
                return new APIResponse<List<FeedbackDTO>>(HttpStatusCode.InternalServerError, "Loi: " + ex.Message);
            }

        }
        [HttpGet("GetFeedbacksByProductId/{productId}")]
        public async Task<APIResponse<List<FeedbackDTO>>> GetFeedbacksByProductId(int productId)
        {
            _logger.LogInformation($"Request received for feedbacks of ProductID: {productId}");
            try
            {
                var feedbacks = await _feedbackRepository.ListFeedbacksByProductId(productId);
                return new APIResponse<List<FeedbackDTO>>(feedbacks, "Lấy danh sách bình luận cho sản phẩm thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách bình luận");
                return new APIResponse<List<FeedbackDTO>>(HttpStatusCode.InternalServerError, "Lỗi: " + ex.Message);
            }
        }

    }
}
