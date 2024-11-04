using System.Data;
using Microsoft.Data.SqlClient;
using GymSport.Connection;
using GymSport.DTOs.FeedBackDTOs;

namespace GymSport.Repository
{
    public class FeedBackRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public FeedBackRepository(SqlConnectionFactory connectionFactory)   // Khởi tạo constructor với SqlConnectionFactory
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<GiveAFeedBackResponseDTO> GiveFeedback(GiveAFeedBackDTO request) // Hàm gửi phản hồi với tham số là CreateFeedbackDTO
        {
           GiveAFeedBackResponseDTO createFeedbackResponseDTO = new GiveAFeedBackResponseDTO();
            using var connection = _connectionFactory.CreateConnection(); // Tạo kết nối tới database
            var command = new SqlCommand("spSubmitProductFeedback", connection) // Liên kết tới stored procedure
            {
                CommandType = CommandType.StoredProcedure
            };

            // Gán các tham số cho stored procedure
            command.Parameters.AddWithValue("@UserID", request.UserID);
            command.Parameters.AddWithValue("@ProductID", request.ProductID);
            command.Parameters.AddWithValue("@Comment", request.Comment);

            // Khai báo các tham số đầu ra
            var outputFeedbackID = new SqlParameter("@FeedbackID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var outputStatusCode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var outputMessage = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            // Thêm các tham số đầu ra vào lệnh
            command.Parameters.Add(outputFeedbackID);
            command.Parameters.Add(outputStatusCode);
            command.Parameters.Add(outputMessage);

            try
            {
                await connection.OpenAsync(); // Mở kết nối
                await command.ExecuteNonQueryAsync(); // Thực thi lệnh

                // Kiểm tra StatusCode trả về từ procedure
                if ((int)outputStatusCode.Value == 0) // Thành công
                {
                    createFeedbackResponseDTO.FeedBackID = (int)outputFeedbackID.Value;
                    createFeedbackResponseDTO.Message = outputMessage.Value.ToString();
                    createFeedbackResponseDTO.IsSuccess = true;
                }
                else // Không thành công
                {
                    createFeedbackResponseDTO.Message = outputMessage.Value.ToString();
                    createFeedbackResponseDTO.IsSuccess = false;
                }

                return createFeedbackResponseDTO; // Trả về DTO với kết quả
            }
            catch (SqlException ex) // Bắt lỗi
            {
                createFeedbackResponseDTO.Message = ex.Message;
                createFeedbackResponseDTO.IsSuccess = false;
                return createFeedbackResponseDTO; // Trả về DTO với thông tin lỗi
            }
        }

        public async Task<List<FeedbackDTO>> ListAllFeedbacks()
        {
            using var connection = _connectionFactory.CreateConnection();
            var command = new SqlCommand("spGetAllFeedbacks", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var feedbacks = new List<FeedbackDTO>();

            while (reader.Read())
            {
                feedbacks.Add(new FeedbackDTO
                {
                    FeedbackID = reader.GetInt32(reader.GetOrdinal("FeedbackID")),
                    Comment = reader.GetString(reader.GetOrdinal("Comment")),
                    FeedbackDate = reader.GetDateTime(reader.GetOrdinal("FeedbackDate")),
                    UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                    LastName = reader.GetString(reader.GetOrdinal("lastname")),
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID"))
                });
            }

            return feedbacks;
        }
        public async Task<List<FeedbackDTO>> ListFeedbacksByProductId(int productId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var command = new SqlCommand("spGetFeedbacksByProductID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Thêm tham số ProductID vào command
            command.Parameters.Add(new SqlParameter("@ProductID", productId));

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var feedbacks = new List<FeedbackDTO>();

            while (reader.Read())
            {
                feedbacks.Add(new FeedbackDTO
                {
                    FeedbackID = reader.GetInt32(reader.GetOrdinal("FeedbackID")),
                    Comment = reader.GetString(reader.GetOrdinal("Comment")),
                    FeedbackDate = reader.GetDateTime(reader.GetOrdinal("FeedbackDate")),
                    UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                    LastName = reader.GetString(reader.GetOrdinal("lastname"))
                    // ProductID không cần thêm vào FeedbackDTO ở đây nếu không được trả về từ procedure
                });
            }

            return feedbacks;
        }

    }
}
