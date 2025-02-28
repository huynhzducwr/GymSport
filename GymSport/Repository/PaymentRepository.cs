using GymSport.Connection;
using GymSport.DTOs.OrderDTOs;
using GymSport.DTOs.PaymentDTOs;
using GymSport.Extensions;
using GymSport.Factory;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;

namespace GymSport.Repository
{
    public class PaymentRepository
    {
        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton

        public async Task<CreatePaymentResponseDTO> CreatePaymentAsync(CreatePaymentDTO paymentDto)
        {
            CreatePaymentResponseDTO responseDTO = new CreatePaymentResponseDTO();

            // Gọi stored procedure CreatePayment
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spCreatePayment", connection);
       
            // Thêm các tham số đầu vào cho stored procedure
            command.Parameters.AddWithValue("@OrderID", paymentDto.OrderID);
            command.Parameters.AddWithValue("@TotalAmount", paymentDto.TotalAmount);
            command.Parameters.AddWithValue("@PaymentMethodID", paymentDto.PaymentMethodID);

            // Không cần thêm PaymentStatus nếu luôn mặc định là 'Pending'
            // command.Parameters.AddWithValue("@PaymentStatus", paymentDto.PaymentStatus);

            // Thêm tham số đầu ra cho PaymentID
            SqlParameter paymentIDParam = new SqlParameter("@PaymentID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(paymentIDParam);

            // Thêm tham số đầu ra cho IsSuccess
            SqlParameter isSuccessParam = new SqlParameter("@IsSuccess", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(isSuccessParam);

            // Thực hiện stored procedure
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            // Lấy giá trị đầu ra PaymentID và IsSuccess
            var paymentId = (int)paymentIDParam.Value;
            var isSuccess = (bool)isSuccessParam.Value;

            // Đặt giá trị cho responseDTO dựa trên kết quả của stored procedure
            if (isSuccess)
            {
                responseDTO.PaymentID = paymentId;
                responseDTO.Message = "Payment created successfully.";
                responseDTO.isCreated = true;
            }
            else
            {
                responseDTO.Message = "Payment creation failed.";
                responseDTO.isCreated = false;
            }

            return responseDTO; // Trả về kết quả
        }
        public async Task<IEnumerable<PaymentDTO>> GetAllpayment()
        {
            var images = new List<PaymentDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllpayment", connection);
           

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                images.Add(new PaymentDTO
                {
                    PaymentID = reader.GetInt32(0),
                    OrderID = reader.GetInt32(1),
                    Amount = reader.GetDecimal(2),
                 
                    PaymentDate = reader.GetDateTime(3),
                    PaymentMethodID = reader.GetInt32(4), // Using the generic method here
                    PaymentStatus = reader.GetString(5),
                    
                });
            }

            return images;
        }
    }
}
