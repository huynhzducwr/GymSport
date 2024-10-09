using GymSport.Connection;
using System.Data;
using GymSport.DTOs.ProductSizeDTOs;
using Microsoft.Data.SqlClient;

namespace GymSport.Repository
{
    public class ProductSizesRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;
        public ProductSizesRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }
    
        
        //Fetch All Room Types Based on the AmenityID
        public async Task<List<FetchProductSizesResponseDTO>> FetchProductSizeBySizeIdAsync(int sizeId)
        {
            var response = new List<FetchProductSizesResponseDTO>();
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spFetchProductSizeBySizeID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@SizeID", sizeId);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new FetchProductSizesResponseDTO
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
        public async Task<ProductSizeResponseDTO> AddProductSizeAsync(ProductSizeDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spAddProductSizes", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.AddWithValue("@SizeID", input.SizeID);
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductSizeResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //Delete the Combination of Amenity Id and Room Type Id
        public async Task<ProductSizeResponseDTO> DeleteProductSizeAsync(ProductSizeDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteSingleProductSize", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@PRoductID", input.ProductID);
            command.Parameters.AddWithValue("@SizeID", input.SizeID);
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductSizeResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //This will Perform Bulk Insert, i.e. one RoomTypeID with many AmenityIDs
        public async Task<ProductSizeResponseDTO> BulkInsertProductSizeAsync(ProductSizeBulkInsertUpdateDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spBulkInsertProductSize", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.Add(CreateSizeIDTableParameter(input.SizeIDs));
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductSizeResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //This will Perform Bulk Update, i.e. one RoomTypeID with many AmenityIDs
        public async Task<ProductSizeResponseDTO> BulkUpdateProductSizeAsync(ProductSizeBulkInsertUpdateDTO input)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spBulkUpdateProductSizes", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ProductID", input.ProductID);
            command.Parameters.Add(CreateSizeIDTableParameter(input.SizeIDs));
            var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
            command.Parameters.Add(statusParam);
            command.Parameters.Add(messageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            return new ProductSizeResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //Delete All Room Amenities By Room Type ID
        public async Task<ProductSizeResponseDTO> DeleteAllProductSizeByProductIDAsync(int roomTypeId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spDeleteAllProductSizeByProductID", connection)
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
            return new ProductSizeResponseDTO
            {
                IsSuccess = (bool)statusParam.Value,
                Message = (string)messageParam.Value
            };
        }
        //Delete All RoomAmenities By Amenity ID
     
        // Helper method to create a SQL parameter for table-valued parameters
        private SqlParameter CreateSizeIDTableParameter(IEnumerable<int> amenityIds)
        {
            var table = new DataTable();
            table.Columns.Add("SizeID", typeof(int));
            foreach (var id in amenityIds)
            {
                table.Rows.Add(id);
            }
            var param = new SqlParameter
            {
                ParameterName = "@SizeIDs",
                SqlDbType = SqlDbType.Structured,
                Value = table,
                TypeName = "SizeIDTableType"
            };
            return param;
        }
    }
}
