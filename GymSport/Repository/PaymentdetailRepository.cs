
using GymSport.DTOs.PaymentDetailsDTO;
namespace GymSport.Repository;
using GymSport.Connection;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;


public class PaymentdetailRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;
        public PaymentdetailRepository(SqlConnectionFactory connectionFactory) // Constructor for dependency injection
        {
            _connectionFactory = connectionFactory;
        }
         public async Task<IEnumerable<PaymentDetailDTO>> GetAllpaymentdetail()
            {
            var images = new List<PaymentDetailDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spGetAllpaymentdetail", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                images.Add(new PaymentDetailDTO
                {
                    PaymentPaymentDetailID = reader.GetInt32(0),
                    PaymentID = reader.GetInt32(1),
                    ProductID = reader.GetInt32(2),
                    Quantity = reader.GetInt32(3),
                    Price = reader.GetDecimal(4),
              
                });
            }

            return images;
        }
    }

