
    using GymSport.Connection;
    using GymSport.DTOs.UserDTOs;
    using GymSport.Extensions;
    using GymSport.Factory;
    using Microsoft.Data.SqlClient;
    using System.Data;
    using GymSport.Email;

namespace GymSport.Repository
{
    public class UserRepository
    {
               private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton
                private readonly IEmailService _emailService; // Inject EmailService

                public UserRepository(IEmailService emailService)
                {
                    _emailService = emailService; // Inject Email Service
                }
        public async Task<CreateUserResponseDTO> RegisterUserAsync(CreateUserDTO user)
            {
                var createUserResponseDTO = new CreateUserResponseDTO();

                try
                {
                    using var connection = _connectionFactory.CreateConnection();
                    using var command = SqlCommandFactory.CreateStoredProcedureCommand("spRegisterUser", connection);

                    command.Parameters.AddWithValue("@Email", user.Email ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@PasswordHash", BCrypt.Net.BCrypt.HashPassword(user.Password));
                    command.Parameters.AddWithValue("@CreatedBy", "System");
                    command.Parameters.AddWithValue("@firstname", user.firstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@lastname", user.lastName ?? (object)DBNull.Value);

                    var userIdParam = new SqlParameter("@UserID", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    var verificationTokenParam = new SqlParameter("@VerificationToken", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
                    var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

                    command.Parameters.Add(userIdParam);
                    command.Parameters.Add(verificationTokenParam);
                    command.Parameters.Add(errorMessageParam);

                    //await connection.OpenAsync().ConfigureAwait(false);
                    //await command.ExecuteNonQueryAsync().ConfigureAwait(false);
                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();

                    createUserResponseDTO.UserID = userIdParam.Value != DBNull.Value ? (int)userIdParam.Value : -1;
                    createUserResponseDTO.IsCreated = createUserResponseDTO.UserID != -1;
                    createUserResponseDTO.Message = createUserResponseDTO.IsCreated
                ? "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác minh tài khoản."
                : errorMessageParam.Value?.ToString() ?? "Đã xảy ra lỗi khi tạo tài khoản";

                    if (createUserResponseDTO.IsCreated)
                    {
                        string verificationToken = verificationTokenParam.Value?.ToString();
                        await _emailService.SendVerificationEmail(user.Email, verificationToken);
                    }
                }
                catch (Exception ex)
                {
                    createUserResponseDTO.IsCreated = false;
                    createUserResponseDTO.Message = $"Lỗi hệ thống: {ex.Message}";
                }

                return createUserResponseDTO;
            }

       

        public async Task<UserRoleResponseDTO> AssignRoleToUserAsync(UserRoleDTO userRole)
        {
            var userRoleResponseDTO = new UserRoleResponseDTO();
            using var connection = _connectionFactory.CreateConnection();
          
             using var command = SqlCommandFactory.CreateStoredProcedureCommand("spAssignUserRole", connection);
        
            command.Parameters.AddWithValue("@UserID", userRole.UserID);
            command.Parameters.AddWithValue("@RoleID", userRole.RoleID);

            var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(errorMessageParam);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var message = errorMessageParam.Value?.ToString();
            if (!string.IsNullOrEmpty(message))
            {
                userRoleResponseDTO.Message = message;
                userRoleResponseDTO.IsAssign = false;
            }
            else
            {
                userRoleResponseDTO.Message = "Phan quuyen thanh cong";
                userRoleResponseDTO.IsAssign = true;
            }
            return userRoleResponseDTO;
        }


        public async Task<List<UserResponseDTO>> ListAllUserAsync(bool? isActive)
        {
            using var connection = _connectionFactory.CreateConnection();

            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spListAllUsers", connection);
          
            command.Parameters.AddWithValue("@IsActive", (object)isActive ?? DBNull.Value);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            var users = new List<UserResponseDTO>();
            while (reader.Read())
            {
                users.Add(new UserResponseDTO
                {
                    UserID = reader.GetInt32("UserID"),
                    Email = reader.GetString("Email"),
                    firstname = reader.GetString("firstname"),
                    lastname = reader.GetString("lastname"),    
                    IsActive = reader.GetBoolean("IsActive"),
                    roleName = reader.GetString("RoleName"),
                    LastLogin = reader.GetValueByColumn<DateTime?>("LastLogin"),
                });
            }
            return users;
        }

        public async Task<UserResponseDTO> GetUserByIDAsync(int userID)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetUserByID", connection);
         
            command.Parameters.AddWithValue("@UserID", userID);
            var errorMessageParam = new SqlParameter("@ErrorMessage",
                SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(errorMessageParam);
            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            if (!reader.Read())
            {
                return null;
            }

            var user = new UserResponseDTO
            {
                UserID = reader.GetInt32("UserID"),
                Email = reader.GetString("Email"),
                firstname = reader.GetString("firstname"),
                lastname = reader.GetString("lastname"),
                IsActive = reader.GetBoolean("IsActive"),
                roleName = reader.GetString("RoleName"),
                LastLogin = reader.GetValueByColumn<DateTime?>("LastLogin"),    

            };
            return user;

        }


        public async Task<UpdateUserResponseDTO> UpdateUserAsync(UpdateUserDTO user)
        {
            var updateUserResponseDTO = new UpdateUserResponseDTO()
            {
                userID = user.userID
            };

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spUpdateUser", connection);
         
    
            command.Parameters.AddWithValue("@UserID",user.userID);
            command.Parameters.AddWithValue("@Email", user.Email);
            command.Parameters.AddWithValue("@firstname", user.firstname);
            command.Parameters.AddWithValue("@lastname", user.lastname);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            command.Parameters.AddWithValue("@PasswordHash", hashedPassword);
            command.Parameters.AddWithValue("@ModifiedBy", "System");


            var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(errorMessageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var message = errorMessageParam.Value?.ToString();
            if (string.IsNullOrEmpty(message))
            {
                updateUserResponseDTO.Message = "Cap nhat thong tin user thanh cong";
                updateUserResponseDTO.isUpdate = true;
            }
            else
            {
                updateUserResponseDTO.Message = message;
                updateUserResponseDTO.isUpdate = false;
            }
            return updateUserResponseDTO;
        }


        public async Task<DeleteUserResponseDTO> DeleteUserAsync(int userID)
        {
            var deleteUserResponseDTO = new DeleteUserResponseDTO();
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleActive", connection);
         
            command.Parameters.AddWithValue("@UserID", userID);
            command.Parameters.AddWithValue("@isActive", false);

            var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(errorMessageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var message = errorMessageParam.Value?.ToString();
            if (!string.IsNullOrEmpty(message))
            {
                deleteUserResponseDTO.Message = message;
                deleteUserResponseDTO.IsDelete = false;
            }
            else
            {
                deleteUserResponseDTO.Message = "Xoa tai khoan thanh cong";
                deleteUserResponseDTO.IsDelete = true;
            }
            return deleteUserResponseDTO;
        }

        public async Task<LoginUserResponseDTO> LoginUserAsync(LoginUserDTO login)
        {
            LoginUserResponseDTO userLoginResponseDTO = new LoginUserResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spLoginUser", connection);
         

            command.Parameters.AddWithValue("@Email", login.Email);

            var passwordHashParam = new SqlParameter("@PasswordHash", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            var userIdParam = new SqlParameter("@UserID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };

            var roleIdParam = new SqlParameter("@RoleID", SqlDbType.Int) // Thêm tham số đầu ra cho RoleID
            {
                Direction = ParameterDirection.Output
            };

            var errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(userIdParam);
            command.Parameters.Add(roleIdParam); // Thêm RoleID vào danh sách tham số
            command.Parameters.Add(errorMessage);
            command.Parameters.Add(passwordHashParam);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var success = userIdParam.Value != DBNull.Value && (int)userIdParam.Value > 0;
            if (success)
            {
                string hashedPasswordFromDb = passwordHashParam.Value.ToString();
                bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(login.Password, hashedPasswordFromDb);

                if (isPasswordCorrect)
                {
                    var userID = Convert.ToInt32(userIdParam.Value);
                    var roleID = roleIdParam.Value != DBNull.Value ? Convert.ToInt32(roleIdParam.Value) : 0; // Lấy giá trị RoleID nếu có

                    userLoginResponseDTO.UserID = userID;
                    userLoginResponseDTO.RoleID = roleID; // Gán RoleID vào DTO
                    userLoginResponseDTO.isLogin = true;
                    userLoginResponseDTO.Message = "Login Successful";
                    return userLoginResponseDTO;
                }
                else
                {
                    userLoginResponseDTO.isLogin = false;
                    userLoginResponseDTO.Message = "Thông tin không hợp lệ";
                    return userLoginResponseDTO;
                }
            }

            var message = errorMessage.Value?.ToString();
            userLoginResponseDTO.isLogin = false;
            userLoginResponseDTO.Message = message;
            return userLoginResponseDTO;
        }


        public async Task<(bool Success, string Message)> ToggleUserActiveAsync(int userId,bool isActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spToggleActive", connection);
        

            command.Parameters.AddWithValue("@UserID", userId);
            command.Parameters.AddWithValue("@isActive",isActive);

            var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(errorMessageParam);
            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();   

            var message = errorMessageParam.Value?.ToString();  
            var success = string.IsNullOrEmpty(message);

            return (success,message);
        }

        public async Task<IEnumerable<RoleDTO>> GetRolesAsync()
        {
            var roles = new List<RoleDTO>();
           
            using var connection = _connectionFactory.CreateConnection();
            using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetUserRoles", connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                roles.Add(new RoleDTO
                {
                    RoleID = reader.GetInt32(0),
                    RoleName = reader.GetString(1)
                });
            }

            return roles;
        }






    }
}
