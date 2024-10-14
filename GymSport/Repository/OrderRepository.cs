using GymSport.Connection;

using Microsoft.Data.SqlClient;
using GymSport.DTOs.OrderDTOs;
using System.Data;

namespace GymSport.Repository
{
    public class OrderRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public OrderRepository(SqlConnectionFactory connectionFactory)   //tao 1 constructor khoi tao truyen 1 bien 
        {
            _connectionFactory = connectionFactory;
        }
        public async Task<CreateOrderResponseDTO> CreateOrderAsync(CreateOrderDTO orderDto)
        {
            CreateOrderResponseDTO responseDTO = new CreateOrderResponseDTO();

            // Chuyển đổi danh sách CartItems thành kiểu bảng OrderDetailType
            var cartItemsTable = new DataTable();
            cartItemsTable.Columns.Add("ProductID", typeof(int));
            cartItemsTable.Columns.Add("Quantity", typeof(int));
            cartItemsTable.Columns.Add("UnitPrice", typeof(decimal));
            cartItemsTable.Columns.Add("ImageURL", typeof(string));
            cartItemsTable.Columns.Add("ProductCategory", typeof(string));
            cartItemsTable.Columns.Add("ProductColor", typeof(string));
            cartItemsTable.Columns.Add("ProductName", typeof(string));
            cartItemsTable.Columns.Add("ProductSize", typeof(string));

            foreach (var item in orderDto.CartItems)
            {
                cartItemsTable.Rows.Add(item.ProductID, item.Quantity, item.UnitPrice, item.ImageURL, item.ProductCategory, item.ProductColor, item.ProductName, item.ProductSize);
            }

            // Gọi stored procedure spCreateOrders
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spCreateOrders", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@UserID", orderDto.UserID);
            command.Parameters.AddWithValue("@ShippingAddress", orderDto.ShippingAddress);
            command.Parameters.AddWithValue("@PhoneNumber", orderDto.PhoneNumber);
            command.Parameters.AddWithValue("@TotalAmount", orderDto.TotalAmount);
            command.Parameters.AddWithValue("@CartItems", cartItemsTable);

            // Thêm tham số đầu ra cho OrderID và IsSuccess
            var orderIDParam = new SqlParameter("@OrderID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(orderIDParam);

            var successParam = new SqlParameter("@IsSuccess", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(successParam);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            // Kiểm tra giá trị của tham số đầu ra
            var isSuccess = (bool)successParam.Value;
            if (isSuccess)
            {
                responseDTO.Message = "Đơn hàng đã được tạo thành công.";
                responseDTO.IsSuccess = true;
                responseDTO.OrderID = (int)orderIDParam.Value;  // Đặt OrderID vào DTO nếu cần
            }
            else
            {
                responseDTO.Message = "Không thành công";
                responseDTO.IsSuccess = false;
            }

            return responseDTO;
        }






    }
}
