using GymSport.Connection;

using GymSport.DTOs.SizeDTOs;
using System.Data;
using Microsoft.Data.SqlClient;
using GymSport.Factory;

namespace GymSport.Repository
{
    public class SizeRepository
    {

        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton
        public async Task<CreateSizeResponseDTO> CreateSize(CreateSizeDTO request) //tao 1 ham tao productcategory
                                                                                                                    //voi bien truyen vao la 1 createProductcatgoryDTO de luu du lieu truyen xuong db
        {
            CreateSizeResponseDTO createProductCategoryResponseDTO = new CreateSizeResponseDTO(); //tao khoi tao 1 doi tuong response de tra ve api
            using var connection = _connectionFactory.CreateConnection(); //goi de khoi tao 1 ham chua chuoi string ket noi toi db
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spCreateSizeType", connection);
          

            command.Parameters.AddWithValue("@SizeName", request.SizeName); //gan du lieu @tendulieu vao request.ten bien de luu xuong db
           

            var outputID = new SqlParameter("@SizeID", SqlDbType.Int)                //lay du lieu tu db len tren day de tham chieu goi toi
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
                    createProductCategoryResponseDTO.SizeID = (int)outputID.Value;
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

        public async Task<UpdateSizeResponseDTO> UpdateSize(UpdateSizeDTO user)
        {
            UpdateSizeResponseDTO updateUserResponseDTO = new UpdateSizeResponseDTO()
            {
                SizeID = user.SizeID
            };

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spUpdateSizeType", connection);
            

            command.Parameters.AddWithValue("@SizeID", user.SizeID);
            command.Parameters.AddWithValue("@SizeName", user.SizeName);




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
                updateUserResponseDTO.Message = "Cap nhat size thanh cong";
                updateUserResponseDTO.isUpdated = true;


            }
            else
            {
                updateUserResponseDTO.Message = message;
                updateUserResponseDTO.isUpdated = false;
            }
            return updateUserResponseDTO;
        }



        public async Task<DeleteSizeResponseDTO> DeleteSize(int productCategoryID)
        {
            var deleteProductCategoryResponseDTO = new DeleteSizeResponseDTO();

            // Create the connection using the factory
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spDeleteSizeType", connection);
            // Define the SQL command and stored procedure
          

            // Adding input parameter
            command.Parameters.AddWithValue("@SizeID", productCategoryID);

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


        public async Task<List<SizeDTO>> ListAllSize(bool? IsActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllSizeTypes", connection);
            
            command.Parameters.AddWithValue("@isActive", (object)IsActive ?? DBNull.Value);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var productCategories = new List<SizeDTO>();

            while (reader.Read())
            {
                productCategories.Add(new SizeDTO
                {
                    SizeID = reader.GetInt32(reader.GetOrdinal("SizeID")),
                    SizeName = reader.GetString(reader.GetOrdinal("SizeName")),
                 
                    isActive = reader.GetBoolean(reader.GetOrdinal("isActive"))
                });
            }
            return productCategories;
        }


        public async Task<SizeDTO> GetSizeByIDAsync(int ProductCategoryID)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetSizeTypeById", connection);
            

            command.Parameters.AddWithValue("@SizeID", ProductCategoryID);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (!reader.Read())
            {
                return null;
            }

            var productCategory = new SizeDTO
            {

                SizeID = reader.GetInt32("SizeID"),
                SizeName = reader.GetString("SizeName"),
                isActive = reader.GetBoolean("IsActive")

            };

            return productCategory;


        }

        public async Task<(bool Success, string Message)> ToggleSizeActiveAsync(int ProductCategoryID, bool isActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleSizeTypeActive", connection);
            

            command.Parameters.AddWithValue("@SizeID", ProductCategoryID);
            command.Parameters.AddWithValue("@isActive", isActive);

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
