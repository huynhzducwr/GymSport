using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymSport.Repository;
using GymSport.Models;
using GymSport.DTOs;
using GymSport.DTOs.UserDTOs;
using System.Net;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly ILogger<UserController> _logger;
        

        public UserController(UserRepository userRepository, ILogger<UserController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }
        [HttpPost ("RegisterUser")]
        public async Task<APIResponse<CreateUserResponseDTO>> RegisterUser(CreateUserDTO createUserDTO)
        {
            _logger.LogInformation("Request Received for register: {@CreateUserDTO}", createUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Du lieu khong hop le trong phan body request");
                return new APIResponse<CreateUserResponseDTO>(HttpStatusCode.BadRequest, "Du lieu khong hop le trong phan body request");
            }
            try
            {
                var response = await _userRepository.RegisterUserAsync(createUserDTO);
                _logger.LogInformation("Add User Response from repository:{@CreateUserResponseDTO}", response);
                if (response.IsCreated)
                {
                    return new APIResponse<CreateUserResponseDTO>(response, response.Message);
                }
                return new APIResponse<CreateUserResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new user with email {Email}", createUserDTO.Email);
                return new APIResponse<CreateUserResponseDTO>(HttpStatusCode.InternalServerError,"Registration Failed.", ex.Message);

            }
        }

        [HttpPost("AssignRole")]
        public async Task<APIResponse<UserRoleResponseDTO>> AssignRole(UserRoleDTO userRoleDTO)
        {
            _logger.LogInformation("Request Received for AssignRole: {@UserRoleDTO}", userRoleDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid Data in the Request Body");
                return new APIResponse<UserRoleResponseDTO>(HttpStatusCode.BadRequest, "Invalid data in the Request body");
            }
            try
            {
                var response = await _userRepository.AssignRoleToUserAsync(userRoleDTO);
                _logger.LogInformation("AssignRole Response From Repository: {@UserRoleResponseDTO}", response);
                if (response.IsAssign)
                {
                    return new APIResponse<UserRoleResponseDTO>(response, response.Message);
                }
                return new APIResponse<UserRoleResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning role {RoleID} to user {UserID}", userRoleDTO.RoleID, userRoleDTO.UserID);
                return new APIResponse<UserRoleResponseDTO>(HttpStatusCode.InternalServerError, "Role Assigned Failed.", ex.Message);
            }
        }


        [HttpGet ("AllUsers")]
        public async Task<APIResponse<List<UserResponseDTO>>> GetAllUsers(bool ? isActive = null)
        {
            _logger.LogInformation($"Request Received for GetAllUsers, IsActive: {isActive}");
            try
            {
                var users = await _userRepository.ListAllUserAsync(isActive);
                return new APIResponse<List<UserResponseDTO>>(users, "Lay danh sach tat ca user thanh cong");
            }catch(Exception ex)
            {
                _logger.LogError(ex, "Error listing users");
                return new APIResponse<List<UserResponseDTO>>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }


        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _userRepository.GetRolesAsync(); // Gọi phương thức để lấy danh sách role
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("GetUser/{userId}")]
        public async Task<APIResponse<UserResponseDTO>> GetUserById(int userId)
        {
            _logger.LogInformation($"Request received for GetUserById,ID: {userId}");
            try
            {
                var user = await _userRepository.GetUserByIDAsync(userId);
                if(user == null)
                {
                    return new APIResponse<UserResponseDTO>(HttpStatusCode.NotFound, "User not found.");

                }
                return new APIResponse<UserResponseDTO>(user, "User fetched successfully");

            }catch(Exception ex) 
                {
                _logger.LogError(ex, "Error getting user by ID {UserID}", userId);
                return new APIResponse<UserResponseDTO>(HttpStatusCode.InternalServerError, "Error fetching user.", ex.Message);

                }


        }
        [HttpPut("Update")]
        public async Task<APIResponse<UpdateUserResponseDTO>> UpdateUser([FromBody] UpdateUserDTO updateUserDTO)
        {
            _logger.LogInformation("Request Received for UpdateUser {@UpdateUserDTO}", updateUserDTO);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateUser Invalid Request Body");
                return new APIResponse<UpdateUserResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }

            try
            {
                var response = await _userRepository.UpdateUserAsync(updateUserDTO);
                if (response.isUpdate)
                {
                    return new APIResponse<UpdateUserResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateUserResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserID}", updateUserDTO.userID);
                return new APIResponse<UpdateUserResponseDTO>(HttpStatusCode.InternalServerError, "Update Failed.", ex.Message);
            }
        }



        [HttpDelete("Delete/{id}")]
        public async Task<APIResponse<DeleteUserResponseDTO>> DeleteUser(int id)
        {
            _logger.LogInformation($"Request Received for DeleteUser, Id: {id}");
            try
            {
                var user = await _userRepository.GetUserByIDAsync(id);
                if (user == null)
                {
                    return new APIResponse<DeleteUserResponseDTO>(HttpStatusCode.NotFound, "User not found.");
                }
                var response = await _userRepository.DeleteUserAsync(id);
                if (response.IsDelete)
                {
                    return new APIResponse<DeleteUserResponseDTO>(response, response.Message);
                }
                return new APIResponse<DeleteUserResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserID}", id);
                return new APIResponse<DeleteUserResponseDTO>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }



        [HttpPost("Login")]
        public async Task<APIResponse<LoginUserResponseDTO>> LoginUser([FromBody] LoginUserDTO loginUserDTO)
        {
            _logger.LogInformation("Request Received for LoginUser {@LoginUserDTO}", loginUserDTO);
            if (!ModelState.IsValid)
            {
                return new APIResponse<LoginUserResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Requrest Body");
            }
            try
            {
                var response = await _userRepository.LoginUserAsync(loginUserDTO); 
                if (response.isLogin)
                {
                    return new APIResponse<LoginUserResponseDTO>(response, response.Message);
                }
                return new APIResponse<LoginUserResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)    
            {
                _logger.LogError(ex, "Error logging in user with email {Email}", loginUserDTO.Email);
                return new APIResponse<LoginUserResponseDTO>(HttpStatusCode.InternalServerError, "Login failed.", ex.Message);
            }
        }


        [HttpPost("ToggleActive")]
        public async Task<IActionResult> ToggleActive([FromQuery] int userId, [FromQuery] bool isActive)
        {
            var result = await _userRepository.ToggleUserActiveAsync(userId, isActive);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result);
        }
    }



}
    

