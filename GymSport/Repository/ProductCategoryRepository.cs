using GymSport.Connection;
using Microsoft.Data.SqlClient;
using GymSport.DTOs.ProductCategoryDTOs;
using System.Data;
using GymSport.DTOs.UserDTOs;
using Microsoft.IdentityModel.Tokens;
using GymSport.Factory;

namespace GymSport.Repository
{
    public class ProductCategoryRepository
    {
        //tao 1 bien Read Only de doc chuoi string ket noi toi co so du lieu
        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton

        public async Task<CreateProductCategoryResponseDTO> CreateProductCategory(CreateProductCategoryDTO request) //tao 1 ham tao productcategory
            //voi bien truyen vao la 1 createProductcatgoryDTO de luu du lieu truyen xuong db
        {
            CreateProductCategoryResponseDTO createProductCategoryResponseDTO = new CreateProductCategoryResponseDTO(); //tao khoi tao 1 doi tuong response de tra ve api
            using var connection = _connectionFactory.CreateConnection(); //goi de khoi tao 1 ham chua chuoi string ket noi toi db
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spCreateProductCatogry", connection);
  

            command.Parameters.AddWithValue("@ProductCategoryName", request.ProductCategoryName); //gan du lieu @tendulieu vao request.ten bien de luu xuong db
            command.Parameters.AddWithValue("@Description", request.Description); //ad du lieu tu khau nhap xuong db
            command.Parameters.AddWithValue("CreatedBy", "System"); //add du lieu tu khau nhap xuong db

            var outputID = new SqlParameter("@ProductCategoryID", SqlDbType.Int)                //lay du lieu tu db len tren day de tham chieu goi toi
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
                    createProductCategoryResponseDTO.ProductCategoryID = (int)outputID.Value;
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

        //update

        public async Task<UpdateProductCategoryResponseDTO> UpdateProductCategory(UpdateProductCategoryDTO user)
        {
            UpdateProductCategoryResponseDTO updateUserResponseDTO = new UpdateProductCategoryResponseDTO()
            {
               ProductCategoryID = user.ProductCategoryID
            };

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spUpdateProductCategory", connection);
          
            command.Parameters.AddWithValue("@ProductCategoryID", user.ProductCategoryID);
            command.Parameters.AddWithValue("@ProductCategoryName", user.ProductCategoryName);
            command.Parameters.AddWithValue("@Description", user.Description);
            command.Parameters.AddWithValue("@ModifiedBy", "System");



            var errorMessageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            var statuscode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(statuscode);
            command.Parameters.Add(errorMessageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var message = errorMessageParam.Value?.ToString();
            if (string.IsNullOrEmpty(message))
            {
                updateUserResponseDTO.Message = "Cap nhat thong tin user thanh cong";
                updateUserResponseDTO.isUpdated = true;
                
                
            }
            else
            {
                updateUserResponseDTO.Message = message;
                updateUserResponseDTO.isUpdated = false;
            }
            return updateUserResponseDTO;
        }



        public async Task<DeleteProductCategoryResponseDTO> DeleteProductCategory(int productCategoryID)
        {
            var deleteProductCategoryResponseDTO = new DeleteProductCategoryResponseDTO();

            // Create the connection using the factory
            using var connection = _connectionFactory.CreateConnection();

            // Define the SQL command and stored procedure
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spDeleteProductCategory", connection);
          

            // Adding input parameter
            command.Parameters.AddWithValue("@ProductCategoryID", productCategoryID);

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
                deleteProductCategoryResponseDTO.Message = messageParam.Value?.ToString();
                deleteProductCategoryResponseDTO.isDeleted = (int)statusCodeParam.Value == 0;
            }
            catch (Exception ex)
            {
                // Log the exception here (not shown for brevity)
                deleteProductCategoryResponseDTO.Message = ex.Message;
                deleteProductCategoryResponseDTO.isDeleted = false;
            }

            return deleteProductCategoryResponseDTO;
        }


        public async Task<List<ProductCategoryDTO>> ListAllProductCategory(bool? IsActive)
        {
            using var connection = _connectionFactory.CreateConnection();

            var command = new SqlCommand("spGetAllProductCategory", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@IsActive", (object)IsActive ?? DBNull.Value);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var productCategories = new List<ProductCategoryDTO>();

            while (reader.Read())
            {
                productCategories.Add(new ProductCategoryDTO
                {
                    ProductCategoryID = reader.GetInt32(reader.GetOrdinal("ProductCategoryID")),
                    ProductCategoryName = reader.GetString(reader.GetOrdinal("ProductCategoryName")),
                    Description = reader.GetString(reader.GetOrdinal("Description")),
                    isActive = reader.GetBoolean(reader.GetOrdinal("isActive"))
                });
            }
            return productCategories;
        }


        public async Task<ProductCategoryDTO> GetProductCategoryByIDAsync(int ProductCategoryID)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetProductCategoryByID", connection);

         

            command.Parameters.AddWithValue("@ProductCategoryID", ProductCategoryID);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (!reader.Read())
            {
                return null;
            }

            var productCategory = new ProductCategoryDTO
            {

                ProductCategoryID = reader.GetInt32("ProductCategoryID"),
                ProductCategoryName = reader.GetString("ProductCategoryName"),
                Description = reader.GetString("Description"),
                isActive = reader.GetBoolean("IsActive")

            };
            
              return productCategory;


        }

        public async Task<(bool Success, string Message)> ToggleProductCategoryActiveAsync(int ProductCategoryID, bool isActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleProductCategoryActive", connection);
         
            command.Parameters.AddWithValue("@ProductCategoryID", ProductCategoryID);
            command.Parameters.AddWithValue("@IsActive", isActive);

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

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
            var ResponseMessage = message.Value.ToString();
            var success = (int)statusCode.Value == 0;
            return (success, ResponseMessage);
        }




    }
}
