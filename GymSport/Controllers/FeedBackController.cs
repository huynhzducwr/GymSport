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

        // Singleton instance cho controller
    private static FeedBackController _instance;
    private static readonly object _lock = new object();
    
    private readonly FeedBackRepository _feedbackRepository;
    private readonly ILogger<FeedBackController> _logger;

    // Constructor private để ngăn tạo instance trực tiếp
    private FeedBackController(FeedBackRepository feedbackRepository, ILogger<FeedBackController> logger)
    {
        _feedbackRepository = feedbackRepository;
        _logger = logger;
    }

    // Method để lấy instance
    public static FeedBackController GetInstance(FeedBackRepository repo, ILogger<FeedBackController> logger)
    {
        if (_instance == null)
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = new FeedBackController(repo, logger);
                }
            }
        }
        return _instance;
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
