using GymSport.Connection;

using Microsoft.Data.SqlClient;
using GymSport.DTOs.OrderDTOs;
using System.Data;
using GymSport.DTOs.InventoryDTOs;
using GymSport.Extensions;
using GymSport.Factory;

namespace GymSport.Repository
{
    public class OrderRepository
    {
        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton
        public async Task<CreateOrderResponseDTO> CreateOrderAsync(CreateOrderDTO orderDto)
        {
            var responseDTO = new CreateOrderResponseDTO();

            try
            {
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

                using var connection = _connectionFactory.CreateConnection();
                using var command = SqlCommandFactory.CreateStoredProcedureCommand("spCreateOrders", connection);
           

                // Thêm các tham số đầu vào
                command.Parameters.AddWithValue("@UserID", orderDto.UserID);
                command.Parameters.AddWithValue("@ShippingAddress", orderDto.ShippingAddress);
                command.Parameters.AddWithValue("@PhoneNumber", orderDto.PhoneNumber);
                command.Parameters.AddWithValue("@TotalAmount", orderDto.TotalAmount);
                command.Parameters.AddWithValue("@City", orderDto.City);
                command.Parameters.AddWithValue("@Province", orderDto.Province);
                command.Parameters.AddWithValue("@FirstName", orderDto.FirstName);
                command.Parameters.AddWithValue("@LastName", orderDto.LastName);
                command.Parameters.AddWithValue("@PostalCode", orderDto.PostalCode);

                // Định dạng kiểu bảng cho CartItems
                var cartItemsParam = command.Parameters.AddWithValue("@CartItems", cartItemsTable);
                cartItemsParam.SqlDbType = SqlDbType.Structured;
                cartItemsParam.TypeName = "dbo.OrderDetailType"; // Đảm bảo kiểu này khớp với SQL Server

                // Thêm tham số đầu ra
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
                    responseDTO.OrderID = (int)orderIDParam.Value;
                }
                else
                {
                    responseDTO.Message = "Không thành công.";
                    responseDTO.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                responseDTO.Message = $"Lỗi hệ thống: {ex.Message}";
                responseDTO.IsSuccess = false;
            }

            return responseDTO;
        }


        public async Task<IEnumerable<OrderDTO>> GetAllOrders()
        {
            var orders = new List<OrderDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllOrders", connection);
    

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                orders.Add(new OrderDTO
                {
                    OrderID = reader.GetInt32(0),
                    UserID = reader.GetInt32(1),
                    FirstName = reader.GetValueByColumn<string>("first_name"),
                    LastName = reader.GetValueByColumn<string>("last_name"),
                    City = reader.GetValueByColumn<string>("city"),
                    Province = reader.GetValueByColumn<string>("province"),
                    PostalCode = reader.GetValueByColumn<string>("postal_code"),
                    OrderDate = reader.GetValueByColumn<DateTime?>("OrderDate"),
                    OrderStatus = reader.GetValueByColumn<string>("OrderStatus"),
                    ShippingAddress = reader.GetValueByColumn<string>("ShippingAddress"),
                    PhoneNumber = reader.GetValueByColumn<string>("PhoneNumber"),
                    TotalAmount = reader.GetDecimal(10), // Đảm bảo đúng index
                });
            }

            return orders;
        }


        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
        {
            var orders = new List<OrderDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetOrdersByUserID", connection);


            // Thêm tham số cho UserID
            command.Parameters.AddWithValue("@UserID", userId);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                orders.Add(new OrderDTO
                {
                    OrderID = reader.GetInt32(0),
                    UserID = reader.GetInt32(1),
                    FirstName = reader.GetValueByColumn<string>("first_name"),
                    LastName = reader.GetValueByColumn<string>("last_name"),
                    City = reader.GetValueByColumn<string>("city"),
                    Province = reader.GetValueByColumn<string>("province"),
                    PostalCode = reader.GetValueByColumn<string>("postal_code"),
                    OrderDate = reader.GetValueByColumn<DateTime?>("OrderDate"),
                    OrderStatus = reader.GetValueByColumn<string>("OrderStatus"),
                    ShippingAddress = reader.GetValueByColumn<string>("ShippingAddress"),
                    PhoneNumber = reader.GetValueByColumn<string>("PhoneNumber"),
                    TotalAmount = reader.GetValueByColumn<decimal>("TotalAmount") // Đổi từ GetDecimal(10)
                });

            }

            return orders;
        }

        public async Task<DeleteOrderResponseDTO> DeleteOrder(int orderID)
        {
            var responseDTO = new DeleteOrderResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spDeleteorder", connection);
         

            command.Parameters.AddWithValue("@OrderID", orderID);

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

        public async Task<(bool Success, string Message)> ToggleOrderStatusActiveAsync(int orderId, string newStatus)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleOrderStatusActive", connection);
       
            // Thêm các tham số đầu vào cho thủ tục lưu trữ
            command.Parameters.AddWithValue("@OrderID", orderId);
            command.Parameters.AddWithValue("@NewStatus", newStatus);

            // Thiết lập tham số đầu ra để nhận mã trạng thái và thông báo từ thủ tục
            var statusCode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var message = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(statusCode);
            command.Parameters.Add(message);

            // Mở kết nối và thực thi thủ tục
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            // Lấy thông báo phản hồi từ thủ tục và kiểm tra thành công hay thất bại
            var responseMessage = message.Value.ToString();
            var success = (int)statusCode.Value == 0;

            // Trả về kết quả
            return (success, responseMessage);
        }






    }
}
