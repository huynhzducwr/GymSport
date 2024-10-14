using GymSport.Connection;
using GymSport.DTOs.ProductColorDTOs;
using System.Data;
using Microsoft.Data.SqlClient;

namespace GymSport.Repository
{
    public class ProductColorsRepository
    {

        private readonly SqlConnectionFactory _connectionFactory;
        public ProductColorsRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }


        //Fetch All Room Types Based on the AmenityID
        public async Task<List<FetchProductColorsResponseDTO>> FetchProductColorByColorIdAsync(int sizeId)
        {
            var response = new List<FetchProductColorsResponseDTO>();
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spFetchProductColorByColorID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ColorID", sizeId);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new FetchProductColorsResponseDTO
                {
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                    ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                    Description = reader.GetString(reader.GetOrdinal("Description")),
                    Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                    ProductCategoryID = reader.GetInt32(reader.GetOrdinal("ProductCategoryID")),
                    isActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
                });
            }
            return response;
        }
        //Add the Combination of Size Id and Product Id
        public async Task<ProductColorResponseDTO> AddProductColorAsync(ProductColorDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spAddProductColors", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.AddWithValue("@ColorID", input.ColorID);
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductColorResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //Delete the Combination of Amenity Id and Room Type Id
        public async Task<ProductColorResponseDTO> DeleteProductColorAsync(ProductColorDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteSingleProductColor", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@PRoductID", input.ProductID);
            command.Parameters.AddWithValue("@ColorID", input.ColorID);
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductColorResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //This will Perform Bulk Insert, i.e. one RoomTypeID with many AmenityIDs
        public async Task<ProductColorResponseDTO> BulkInsertProductColorAsync(ProductColorBulkInsertUpdateDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spBulkInsertProductColor", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.Add(CreateColorIDTableParameter(input.ColorIDs));
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductColorResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //This will Perform Bulk Update, i.e. one RoomTypeID with many AmenityIDs
        public async Task<ProductColorResponseDTO> BulkUpdateProductColorAsync(ProductColorBulkInsertUpdateDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spBulkUpdateProductColors", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.Add(CreateColorIDTableParameter(input.ColorIDs));
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductColorResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //Delete All Room Amenities By Room Type ID
        public async Task<ProductColorResponseDTO> DeleteAllProductColorByProductIDAsync(int roomTypeId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteAllProductColorByProductID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", roomTypeId);
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductColorResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }


        // Helper method to create a SQL parameter for table-valued parameters
        private SqlParameter CreateColorIDTableParameter(IEnumerable<int> amenityIds)
        {
            var table = new DataTable();
            table.Columns.Add("SizeID", typeof(int));
            foreach (var id in amenityIds)
            {
                table.Rows.Add(id);
            }
            var param = new SqlParameter
            {
                ParameterName = "@ColorIDs",
                SqlDbType = SqlDbType.Structured,
                Value = table,
                TypeName = "ColorIDTableType"
            };
            return param;
        }

        public async Task<List<ProductColorDTO>> ListAllProductColor()
        {
            using var connection = _connectionFactory.CreateConnection();

            var command = new SqlCommand("spGetAllProductColor", connection)
            {
                CommandType = CommandType.StoredProcedure
            };


            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var productCategories = new List<ProductColorDTO>();

            while (reader.Read())
            {
                productCategories.Add(new ProductColorDTO
                {
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                    ColorID = reader.GetInt32(reader.GetOrdinal("ColorID")),
                    ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                    ColorName = reader.GetString(reader.GetOrdinal("ColorName"))
                });
            }
            return productCategories;
        }
    }
}
