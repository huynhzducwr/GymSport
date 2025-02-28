using GymSport.Connection;
using GymSport.Factory;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace GymSport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public EmailController(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        [HttpGet("VerifyEmail")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token không được để trống!" });
            }

            try
            {
                using var connection = _connectionFactory.CreateConnection();
                using var command = SqlCommandFactory.CreateStoredProcedureCommand("spVerifyEmail", connection);

                command.Parameters.AddWithValue("@Token", token);
                var resultParam = new SqlParameter("@Result", SqlDbType.Bit) { Direction = ParameterDirection.Output };
                command.Parameters.Add(resultParam);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                bool isVerified = resultParam.Value != DBNull.Value && (bool)resultParam.Value;

                if (isVerified)
                {
                    return Ok(new { message = "Xác minh email thành công!", success = true });
                }
                else
                {
                    return BadRequest(new { message = "Token không hợp lệ hoặc đã hết hạn!", success = false });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}", success = false });
            }
        }
    }
}
