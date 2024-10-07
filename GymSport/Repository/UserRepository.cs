
using GymSport.Connection;
using GymSport.DTOs.UserDTOs;
using GymSport.Extensions;
using Microsoft.Data.SqlClient;
using System.Data;
namespace GymSport.Repository
{
    public class UserRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;
        public UserRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }


        public async Task<CreateUserResponseDTO> RegisterUserAsync(CreateUserDTO user)
        {
            CreateUserResponseDTO createUserResponseDTO = new CreateUserResponseDTO();
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spRegisterUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Email", user.Email);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            command.Parameters.AddWithValue("@PasswordHash", hashedPassword);
            command.Parameters.AddWithValue("@CreatedBy", "System");
            command.Parameters.AddWithValue("@firstname", user.firstName);
            command.Parameters.AddWithValue("@lastname", user.lastName);

            var userIdParam = new SqlParameter("@UserID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var errorMessageParam = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(userIdParam);
            command.Parameters.Add(errorMessageParam);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var UserID = (int)userIdParam.Value;
            if (UserID != -1)
            {
                createUserResponseDTO.UserID = UserID;
                createUserResponseDTO.IsCreated = true;
                createUserResponseDTO.Message = "Dang ki tai khoan thanh cong";
                return createUserResponseDTO;
            }

            var message = errorMessageParam.Value?.ToString();
            createUserResponseDTO.IsCreated = false;
            createUserResponseDTO.Message = message ?? "Da xay ra loi khi tao tai khoan";
            return createUserResponseDTO;

        }


        public async Task<UserRoleResponseDTO> AssignRoleToUserAsync(UserRoleDTO userRole)
        {
            UserRoleResponseDTO userRoleResponseDTO = new UserRoleResponseDTO();
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spAssignUserRole",connection)
            {
                CommandType = CommandType.StoredProcedure
            };
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
            using var command = new SqlCommand("spListAllUsers", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
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
            using var command = new SqlCommand("spGetUserByID", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
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
            UpdateUserResponseDTO updateUserResponseDTO = new UpdateUserResponseDTO()
            {
                userID = user.userID
            };

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUpdateUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
    
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
            DeleteUserResponseDTO deleteUserResponseDTO = new DeleteUserResponseDTO();
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spToggleActive", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
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
            using var command = new SqlCommand("spLoginUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Email",login.Email);

            var passwordHashParam = new SqlParameter("@PasswordHash", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            var userIdParam = new SqlParameter("@UserID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };

            var errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(userIdParam);
            command.Parameters.Add(errorMessage);
            command.Parameters.Add(passwordHashParam);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var success = userIdParam.Value != DBNull.Value && (int)userIdParam.Value > 0;  
            if (success)
            {
                string hashedPasswordFromDb = passwordHashParam.Value.ToString();
                bool isPasswordCorrect =BCrypt.Net.BCrypt.Verify(login.Password, hashedPasswordFromDb);

                if (isPasswordCorrect)
                {
                    var userID = Convert.ToInt32(userIdParam.Value);
                    userLoginResponseDTO.UserID = userID;
                    userLoginResponseDTO.isLogin = true;
                    userLoginResponseDTO.Message = "Login Successful";
                    return userLoginResponseDTO;
                }
                else
                {
                    userLoginResponseDTO.isLogin = false;
                    userLoginResponseDTO.Message = "Thong tin khong hop le";
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
            using var command = new SqlCommand("spToggleActive", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

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
            var command = new SqlCommand("spGetUserRoles", connection); // Thay đổi tên bảng nếu cần

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
