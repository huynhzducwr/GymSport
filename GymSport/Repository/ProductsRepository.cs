﻿using GymSport.Connection;
using GymSport.DTOs.ProductDTOs;
using GymSport.Factory;
using Microsoft.Data.SqlClient;
using System.Data;

namespace GymSport.Repository
{
        public class ProductsRepository
        {
            private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton

            public async Task<CreateProductResponseDTO> CreateProductAsync(CreateProductRequestDTO request)
            {
                using var connection = _connectionFactory.CreateConnection();
                using var command = new SqlCommand("spCreateProduct", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Ensure these parameters match your stored procedure definition
                command.Parameters.Add("@ProductID", SqlDbType.Int).Direction = ParameterDirection.Output; // Output parameter
                command.Parameters.AddWithValue("@ProductName", request.ProductName);
                command.Parameters.AddWithValue("@Description", request.Description);
                command.Parameters.AddWithValue("@ProductCategoryID", request.ProductCategoryID);
                command.Parameters.AddWithValue("@Price", request.Price);
                command.Parameters.AddWithValue("@Status", request.Status);

                // Output parameters
                command.Parameters.Add("@StatusCode", SqlDbType.Int).Direction = ParameterDirection.Output;
                command.Parameters.Add("@Message", SqlDbType.NVarChar, 255).Direction = ParameterDirection.Output;

                try
                {
                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();

                    var outputProductID = command.Parameters["@ProductID"].Value;
                    var newProductID = outputProductID != DBNull.Value ? Convert.ToInt32(outputProductID) : 0;

                    return new CreateProductResponseDTO
                    {
                        ProductID = newProductID,
                        IsCreated = (int)command.Parameters["@StatusCode"].Value == 0,
                        Message = (string)command.Parameters["@Message"].Value
                    };
                }
                catch (Exception ex)
                {
                    throw new Exception($"Error creating product: {ex.Message}", ex);
                }
            }

        public async Task<UpdateProductResponseDTO> UpdateProductAsync(UpdateProductRequestDTO request)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spUpdateProduct", connection);
          

            command.Parameters.AddWithValue("@ProductID", request.ProductID);
            command.Parameters.AddWithValue("@ProductName", request.ProductName);
            command.Parameters.AddWithValue("@Description", request.Description);
            command.Parameters.AddWithValue("@ProductCategoryID", request.ProductCategoryID);
            command.Parameters.AddWithValue("@Price", request.Price);
            command.Parameters.AddWithValue("@isActive", request.isActive);
            command.Parameters.AddWithValue("@Status", request.Status);
            command.Parameters.AddWithValue("@ModifiedBy", "System");
            command.Parameters.Add("@StatusCode", SqlDbType.Int).Direction = ParameterDirection.Output;
            command.Parameters.Add("@Message", SqlDbType.NVarChar, 255).Direction = ParameterDirection.Output;

            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return new UpdateProductResponseDTO
                {
                    ProductID = request.ProductID,
                    IsUpdated = (int)command.Parameters["@StatusCode"].Value == 0,
                    Message = (string)command.Parameters["@Message"].Value
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating product: {ex.Message}", ex);
            }
        }

        public async Task<DeleteProductResponseDTO> DeleteProductAsync(int productId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spDeleteProduct", connection);
       
            command.Parameters.AddWithValue("@ProductID", productId);
            command.Parameters.Add("@StatusCode", SqlDbType.Int).Direction = ParameterDirection.Output;
            command.Parameters.Add("@Message", SqlDbType.NVarChar, 255).Direction = ParameterDirection.Output;

            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();
                return new DeleteProductResponseDTO
                {
                    IsDeleted = (int)command.Parameters["@StatusCode"].Value == 0,
                    Message = (string)command.Parameters["@Message"].Value
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting product: {ex.Message}", ex);
            }
        }

        public async Task<ProductDetailResponseDTO> GetProductByIdAsync(int productId)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetProductByID", connection);

            command.Parameters.AddWithValue("@ProductID", productId);

            try
            {
                await connection.OpenAsync();
                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new ProductDetailResponseDTO
                    {
                        ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                        ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? string.Empty : reader.GetString(reader.GetOrdinal("ProductName")),
                        Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description")),
                        Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Price")),
                        isActive = reader.IsDBNull(reader.GetOrdinal("isActive")) ? false : reader.GetBoolean(reader.GetOrdinal("isActive")),
                        ProductCategoryID = reader.IsDBNull(reader.GetOrdinal("ProductCategoryID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductCategoryID")), // Thêm ID danh mục
                        ProductCategoryName = reader.IsDBNull(reader.GetOrdinal("ProductCategoryName")) ? string.Empty : reader.GetString(reader.GetOrdinal("ProductCategoryName")),
                        Status = reader.IsDBNull(reader.GetOrdinal("Status")) ? string.Empty : reader.GetString(reader.GetOrdinal("Status")),
                        ModifiedDate = reader.IsDBNull(reader.GetOrdinal("ModifiedDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("ModifiedDate"))
                    };
                }
                else
                {
                    return null; // Product not found
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving product by ID: {ex.Message}", ex);
            }
        }



        public async Task<CreateProductResponseDTO> CloneProductAsync(int productId)
        {
            // Bước 1: Lấy thông tin sản phẩm gốc
            var existingProduct = await GetProductByIdAsync(productId);
            if (existingProduct == null)
            {
                return new CreateProductResponseDTO
                {
                    ProductID = 0,
                    IsCreated = false,
                    Message = "Product not found."
                };
            }

            // Bước 2: Tạo DTO yêu cầu sản phẩm mới từ dữ liệu sản phẩm gốc
            var clonedProductRequest = new CreateProductRequestDTO
            {
                ProductName = existingProduct.ProductName + " (Copy)", // Đổi tên tránh trùng lặp
                Description = existingProduct.Description,
                ProductCategoryID = existingProduct.ProductCategoryID, // Đã có ID, không phải Name
                Price = existingProduct.Price,
                Status = existingProduct.Status
            };

            // Bước 3: Tạo sản phẩm mới bằng cách gọi CreateProductAsync
            return await CreateProductAsync(clonedProductRequest);
        }



        public async Task<List<ProductDetailResponseDTO>> GetAllProductsAsync(GetAllProductsRequestDTO request)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllProducts", connection);
            

            // Add parameters for ProductCategoryID and Status, handling nulls appropriately
            command.Parameters.Add(new SqlParameter("@ProductCategoryID", SqlDbType.Int)
            {
                Value = request.ProductCategoryID.HasValue ? (object)request.ProductCategoryID.Value : DBNull.Value
            });

            command.Parameters.Add(new SqlParameter("@Status", SqlDbType.NVarChar, 50)
            {
                Value = string.IsNullOrEmpty(request.Status) ? DBNull.Value : (object)request.Status
            });

            try
            {
                await connection.OpenAsync();
                var products = new List<ProductDetailResponseDTO>();
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    // Read and check each field for DBNull before accessing
                    var product = new ProductDetailResponseDTO
                    {
                        ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                        ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? string.Empty : reader.GetString(reader.GetOrdinal("ProductName")),
                        Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description")),
                        Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Price")),
                        isActive = reader.IsDBNull(reader.GetOrdinal("isActive")) ? false : reader.GetBoolean(reader.GetOrdinal("isActive")),
                        ProductCategoryName = reader.IsDBNull(reader.GetOrdinal("ProductCategoryName")) ? string.Empty : reader.GetString(reader.GetOrdinal("ProductCategoryName")),
                        Status = reader.IsDBNull(reader.GetOrdinal("Status")) ? string.Empty : reader.GetString(reader.GetOrdinal("Status")),
                        ModifiedDate = reader.IsDBNull(reader.GetOrdinal("ModifiedDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("ModifiedDate"))
                    };

                    products.Add(product);
                }
                return products;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving all products: {ex.Message}", ex);
            }
        }

        public async Task<(bool Success, string Message)> ToggleProductActiveAsync(int ProductID, bool isActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleProductActive", connection);
         
            command.Parameters.AddWithValue("@ProductID", ProductID);
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
