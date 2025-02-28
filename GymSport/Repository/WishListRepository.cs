using GymSport.Connection;
using GymSport.DTOs.WishListDTOs;
using System.Data;
using Microsoft.Data.SqlClient;
using GymSport.DTOs.SizeDTOs;
using GymSport.Factory;
namespace GymSport.Repository
{
    public class WishListRepository
    {

        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton

        public async Task<CreateWishListDTOResponseDTO> CreateWishList(CreateWishListDTO request) //tao 1 ham tao productcategory
                                                                                   //voi bien truyen vao la 1 createProductcatgoryDTO de luu du lieu truyen xuong db
        {
            CreateWishListDTOResponseDTO createProductCategoryResponseDTO = new CreateWishListDTOResponseDTO(); //tao khoi tao 1 doi tuong response de tra ve api
            using var connection = _connectionFactory.CreateConnection(); //goi de khoi tao 1 ham chua chuoi string ket noi toi db
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spAddProductToWishlist", connection);
            

            command.Parameters.AddWithValue("@UserID", request.UserID);
            command.Parameters.AddWithValue("@ProductID", request.ProductID);
            command.Parameters.AddWithValue("@ProductName", request.ProductName);
            command.Parameters.AddWithValue("@Price", request.Price);
            command.Parameters.AddWithValue("@ProductCategoryName", request.ProductCategoryName);
            command.Parameters.AddWithValue("@ImageID", request.ImageID);
            command.Parameters.AddWithValue("@ImageURL", request.ImageURL);
         //gan du lieu @tendulieu vao request.ten bien de luu xuong db


            var outputID = new SqlParameter("@FavoriteID", SqlDbType.Int)                //lay du lieu tu db len tren day de tham chieu goi toi
            {
                Direction = ParameterDirection.Output
            };

            var outputStatusCode = new SqlParameter("@StatusCode", SqlDbType.Int)   // lay du lieu tu db len
            {
                Direction = ParameterDirection.Output
            };
            var outputMessage = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(outputMessage);
            command.Parameters.Add(outputID);
            command.Parameters.Add(outputStatusCode);
            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                if ((int)outputStatusCode.Value == 0)
                {
                    createProductCategoryResponseDTO.FavoriteID = (int)outputID.Value;
                    createProductCategoryResponseDTO.Message = outputMessage.Value.ToString();
                    createProductCategoryResponseDTO.isCreated = true;
                    return createProductCategoryResponseDTO;
                }
                createProductCategoryResponseDTO.Message = outputMessage.Value.ToString();
                createProductCategoryResponseDTO.isCreated = false;
                return createProductCategoryResponseDTO;


            }
            catch (SqlException ex)
            {
                createProductCategoryResponseDTO.Message = ex.Message;
                createProductCategoryResponseDTO.isCreated = false;
                return createProductCategoryResponseDTO;
            }

        }

        public async Task<DeleteWishListResponseDTO> DeleteWishList(int userID, int productID)
        {
            var deleteWishListResponseDTO = new DeleteWishListResponseDTO();

            // Create the connection using the factory
            using var connection = _connectionFactory.CreateConnection();

            // Define the SQL command and stored procedure
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spRemoveProductFromWishlist", connection);
          
            // Adding input parameters for UserID and ProductID
            command.Parameters.AddWithValue("@UserID", userID);
            command.Parameters.AddWithValue("@ProductID", productID);

            // Adding output parameters for status and message
            var statusCodeParam = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(statusCodeParam);
            command.Parameters.Add(messageParam);

            try
            {
                // Open the connection
                await connection.OpenAsync();

                // Execute the command
                await command.ExecuteNonQueryAsync();

                // Populate the response DTO
                deleteWishListResponseDTO.Message = messageParam.Value?.ToString();
                deleteWishListResponseDTO.isDeleted = (int)statusCodeParam.Value == 0;
            }
            catch (Exception ex)
            {
                // Log the exception here (not shown for brevity)
                deleteWishListResponseDTO.Message = ex.Message;
                deleteWishListResponseDTO.isDeleted = false;
            }

            return deleteWishListResponseDTO;
        }





        public async Task<List<WishListDTO>> ListAllWishList()
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllWishList", connection);
         

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var productCategories = new List<WishListDTO>();

            while (reader.Read())
            {
                productCategories.Add(new WishListDTO
                {
                   FavoriteID = reader.GetInt32(reader.GetOrdinal("FavoriteID")),
                    UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                    ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                    ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                    Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Price")),
                    ProductCategoryName = reader.GetString(reader.GetOrdinal("ProductCategoryName")),
                    ImageID = reader.GetInt32(reader.GetOrdinal("ImageID")),
                    ImageURL = reader.GetString(reader.GetOrdinal("ImageURL"))

                });
            }
            return productCategories;
        }


        public async Task<WishListDTO> GetWishListByIDAsync(int ProductCategoryID)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetProductWishListById", connection);
      

            command.Parameters.AddWithValue("@FavoriteID", ProductCategoryID);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (!reader.Read())
            {
                return null;
            }

            var productCategory = new WishListDTO
            {
                FavoriteID = reader.GetInt32(reader.GetOrdinal("FavoriteID")),
                UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
     
                Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Price")),    
                ProductCategoryName = reader.GetString(reader.GetOrdinal("ProductCategoryName")),
                ImageID = reader.GetInt32(reader.GetOrdinal("ImageID")),
                ImageURL = reader.GetString(reader.GetOrdinal("ImageURL"))

            };

            return productCategory;


        }




    }
}
