using GymSport.Connection;

using Microsoft.Data.SqlClient;
using GymSport.DTOs.OrderDetailsDTOs;
using System.Data;
using GymSport.DTOs.InventoryDTOs;
using GymSport.Extensions;
using GymSport.Controllers;

namespace GymSport.Repository
{
    public class OrderDetailsRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public OrderDetailsRepository(SqlConnectionFactory connectionFactory)   //tao 1 constructor khoi tao truyen 1 bien 
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<OrderDetailsDTO>> GetAllOrderDetails()
        {
            var images = new List<OrderDetailsDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spGetAllOrderDetails", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                images.Add(new OrderDetailsDTO
                {
                    OrderDetailID = reader.GetInt32(reader.GetOrdinal("OrderDetailID")),  // Use GetOrdinal for named columns
                    OrderID = reader.GetInt32(reader.GetOrdinal("OrderID")),
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),

                    // Use a helper function to handle nulls safely
                    ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductName")),

                    ImageURL = reader.IsDBNull(reader.GetOrdinal("ImageURL"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ImageURL")),
                    ProductCategory = reader.IsDBNull(reader.GetOrdinal("ProductCategory"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductCategory")),
                    ProductColor = reader.IsDBNull(reader.GetOrdinal("ProductColor"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductColor")),

                    ProductSize = reader.IsDBNull(reader.GetOrdinal("ProductSize"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductSize")),

                    Quantity = reader.GetInt32(reader.GetOrdinal("Quantity")),

                    // For UnitPrice, assume it's always a decimal
                    UnitPrice = reader.GetDecimal(reader.GetOrdinal("UnitPrice")),

                    // Handle nullable DateTime
                    OrderDate = (reader.GetValue(reader.GetOrdinal("OrderDate")) as DateTime?) ?? DateTime.MinValue,


                    TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount")),

                    // OrderStatus is a string, handle null safely if needed
                    OrderStatus = reader.IsDBNull(reader.GetOrdinal("OrderStatus"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("OrderStatus")),

                });
            }
            
            return images;
        }

        public async Task<IEnumerable<OrderDetailsDTO>> GetOrderDetailsByOrderID(int orderId)
        {
            var orderDetailsList = new List<OrderDetailsDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spGetOrderDetailsByOrderID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Thêm tham số đầu vào cho OrderID
            command.Parameters.AddWithValue("@OrderID", orderId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                orderDetailsList.Add(new OrderDetailsDTO
                {
                    OrderDetailID = reader.GetInt32(reader.GetOrdinal("OrderDetailID")),
                    OrderID = reader.GetInt32(reader.GetOrdinal("OrderID")),
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),

                    // Sử dụng hàm kiểm tra null cho ProductName
                    ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("ProductName")),
                    ImageURL = reader.IsDBNull(reader.GetOrdinal("ImageURL"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ImageURL")),
                    ProductCategory = reader.IsDBNull(reader.GetOrdinal("ProductCategory"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductCategory")),
                    ProductColor = reader.IsDBNull(reader.GetOrdinal("ProductColor"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductColor")),

                    ProductSize = reader.IsDBNull(reader.GetOrdinal("ProductSize"))
                      ? null
                      : reader.GetString(reader.GetOrdinal("ProductSize")),

                    Quantity = reader.GetInt32(reader.GetOrdinal("Quantity")),

                    // Đảm bảo UnitPrice luôn là kiểu decimal
                    UnitPrice = reader.GetDecimal(reader.GetOrdinal("UnitPrice")),

                    // Xử lý DateTime có thể là null
                    OrderDate = (reader.GetValue(reader.GetOrdinal("OrderDate")) as DateTime?) ?? DateTime.MinValue,

                    TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount")),

                    // Xử lý OrderStatus với trường hợp null
                    OrderStatus = reader.IsDBNull(reader.GetOrdinal("OrderStatus"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("OrderStatus")),
                });
            }

            return orderDetailsList;
        }



        public async Task<DeleteOrderDetailsResponseDTO> DeleteOrderDetails(int OrderDetailID)
        {
            DeleteOrderDetailsResponseDTO responseDTO = new DeleteOrderDetailsResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteOrderDetail", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@OrderDetailID", OrderDetailID);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync(); // Sử dụng ExecuteScalar để lấy thông điệp kết quả

            if (result != null)
            {
                responseDTO.Message = result.ToString();
                responseDTO.IsDeleted = true;
            }
            else
            {
                responseDTO.Message = "order không tồn tại.";
                responseDTO.IsDeleted = false;
            }

            return responseDTO;
        }







    }
}
