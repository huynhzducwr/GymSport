using GymSport.Connection;
using GymSport.DTOs.PaymentMethodsDTOs;
using System.Data;
using Microsoft.Data.SqlClient;
using GymSport.DTOs.ProductCategoryDTOs;
using GymSport.Factory;

namespace GymSport.Repository
{
    public class PaymentMethodRepository
    {
        private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton
        public async Task<CreatePaymentMethodResponseDTO> CreatePaymentMethod(CreatePaymentMethodDTO request) //tao 1 ham tao productcategory
                                                                                                                    //voi bien truyen vao la 1 createProductcatgoryDTO de luu du lieu truyen xuong db
        {
            var createProductCategoryResponseDTO = new CreatePaymentMethodResponseDTO(); //tao khoi tao 1 doi tuong response de tra ve api
            using var connection = _connectionFactory.CreateConnection(); //goi de khoi tao 1 ham chua chuoi string ket noi toi db
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spCreatePaymentMethod", connection);
         

            command.Parameters.AddWithValue("@PaymentMethodName", request.PaymentMethodName); //gan du lieu @tendulieu vao request.ten bien de luu xuong db
          
       

            var outputID = new SqlParameter("@PaymentMethodID", SqlDbType.Int)                //lay du lieu tu db len tren day de tham chieu goi toi
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
                    createProductCategoryResponseDTO.PaymentMethodID = (int)outputID.Value;
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


        public async Task<List<PaymentMethodDTO>> ListAllPaymentMethod(bool? IsActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllPaymentMethod", connection);

          
            command.Parameters.AddWithValue("@isActive", (object)IsActive ?? DBNull.Value);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            var productCategories = new List<PaymentMethodDTO>();

            while (reader.Read())
            {
                productCategories.Add(new PaymentMethodDTO
                {
                    PaymentMethodID = reader.GetInt32(reader.GetOrdinal("PaymentMethodID")),
                    PaymentMethodName = reader.GetString(reader.GetOrdinal("PaymentMethodName")),
                
                    isActive = reader.GetBoolean(reader.GetOrdinal("isActive"))
                });
            }
            return productCategories;
        }
    }
}
