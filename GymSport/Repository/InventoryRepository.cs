using GymSport.Connection;
using GymSport.DTOs.InventoryDTOs;
using System.Data;
using Microsoft.Data.SqlClient;

namespace GymSport.Repository
{
    public class InventoryRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;


        public InventoryRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<CreateInventoryResponseDTO> CreateInventoryAsync(CreateInventoryDTO uploadImageDTO)
        {
            CreateInventoryResponseDTO responseDTO = new CreateInventoryResponseDTO();


                // Lưu vào cơ sở dữ liệu
                using var connection = _connectionFactory.CreateConnection();
                using var command = new SqlCommand("spCreateInventory", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@ProductID", uploadImageDTO.ProductID);
                command.Parameters.AddWithValue("@StockQuantity", uploadImageDTO.StockQuantity);

                await connection.OpenAsync();
                var result = await command.ExecuteScalarAsync();

                if (result != null)
                {
                    responseDTO.Message = result.ToString();
                    responseDTO.IsSuccess = true;
                }
                else
                {
                    responseDTO.Message = "Khong thanh cong";
                    responseDTO.IsSuccess = false;
                }
          
            return responseDTO;
        }

        public async Task<IEnumerable<InventoryDTO>> GetAllInventoryAsync()
        {
            var images = new List<InventoryDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spGetAllInventory", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                images.Add(new InventoryDTO
                {
                    InventoryID = reader.GetInt32(0), // ID của hình ảnh
                    ProductID = reader.GetInt32(1), // ID của sản phẩm liên quan
                    StockQuantity = reader.GetInt32(2),
                    ProductName = reader.GetString(3)
                });
            }

            return images;
        }


        public async Task<DeleteInventoryResponseDTO> DeleteInventoryAsync(int imageID)
        {
            DeleteInventoryResponseDTO responseDTO = new DeleteInventoryResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteInventory", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@InventoryID", imageID);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync(); // Sử dụng ExecuteScalar để lấy thông điệp kết quả

            if (result != null)
            {
                responseDTO.Message = result.ToString();
                responseDTO.IsDeleted = true;
            }
            else
            {
                responseDTO.Message = "Inventory không tồn tại.";
                responseDTO.IsDeleted = false;
            }

            return responseDTO;
        }
    }
}
