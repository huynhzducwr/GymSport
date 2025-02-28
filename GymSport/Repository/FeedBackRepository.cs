using System.Data;
using Microsoft.Data.SqlClient;
using GymSport.Connection;
using GymSport.DTOs.FeedBackDTOs;
using GymSport.Factory;

namespace GymSport.Repository
{
    public class FeedBackRepository
    {
        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton

        public async Task<GiveAFeedBackResponseDTO> GiveFeedback(GiveAFeedBackDTO request)
        {
            var createFeedbackResponseDTO = new GiveAFeedBackResponseDTO();
            using var connection = _connectionFactory.CreateConnection(); // Create a connection to the database
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spSubmitProductFeedback", connection);
           
            // Assign parameters for the stored procedure
            command.Parameters.AddWithValue("@UserID", request.UserID);
            command.Parameters.AddWithValue("@ProductID", request.ProductID);
            command.Parameters.AddWithValue("@Rating", request.Rating); // Add Rating parameter
            command.Parameters.AddWithValue("@Comment", request.Comment);

            // Declare output parameters
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

            // Add output parameters to command
            command.Parameters.Add(outputFeedbackID);
            command.Parameters.Add(outputStatusCode);
            command.Parameters.Add(outputMessage);

            try
            {
                await connection.OpenAsync(); // Open connection
                await command.ExecuteNonQueryAsync(); // Execute command

                // Check the StatusCode returned from the procedure
                if ((int)outputStatusCode.Value == 0) // Success
                {
                    createFeedbackResponseDTO.FeedBackID = (int)outputFeedbackID.Value;
                    createFeedbackResponseDTO.Message = outputMessage.Value.ToString();
                    createFeedbackResponseDTO.IsSuccess = true;
                }
                else // Not successful
                {
                    createFeedbackResponseDTO.Message = outputMessage.Value.ToString();
                    createFeedbackResponseDTO.IsSuccess = false;
                }

                return createFeedbackResponseDTO; // Return DTO with the result
            }
            catch (SqlException ex) // Catch errors
            {
                createFeedbackResponseDTO.Message = ex.Message;
                createFeedbackResponseDTO.IsSuccess = false;
                return createFeedbackResponseDTO; // Return DTO with error information
            }
        }

        public async Task<List<FeedbackDTO>> ListAllFeedbacks()
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllFeedbacks", connection);
          

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
                    Rating = reader.GetInt32(reader.GetOrdinal("Rating")),
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
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetFeedbacksByProductID", connection);
       

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
                    Rating = reader.GetInt32(reader.GetOrdinal("Rating")),
                    UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                    LastName = reader.GetString(reader.GetOrdinal("lastname"))
                    // ProductID không cần thêm vào FeedbackDTO ở đây nếu không được trả về từ procedure
                });
            }

            return feedbacks;
        }

    }
}
