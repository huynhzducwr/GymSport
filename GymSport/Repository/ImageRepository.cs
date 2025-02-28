using System.Data;
using System.IO;
using System.Threading.Tasks;
using GymSport.Connection;
using GymSport.DTOs.ImageDTOs;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using GymSport.Factory;

public class ImageRepository
{
    private static readonly SqlConnectionFactory _connectionFactory = SqlConnectionFactory.Instance; // Dùng Singleton
    private static readonly string _imageFolderPath;

    // Khối static constructor để khởi tạo đường dẫn & tạo thư mục
    static ImageRepository()
    {
        _imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        Directory.CreateDirectory(_imageFolderPath); // Tạo thư mục nếu không tồn tại
    }

  

    public async Task<UploadImageResponseDTO> UploadImageForProductAsync(UploadImageDTO uploadImageDTO)
    {
        UploadImageResponseDTO responseDTO = new UploadImageResponseDTO();

        if (uploadImageDTO.ImageFile.Length > 0)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(uploadImageDTO.ImageFile.FileName);
            var filePath = Path.Combine(_imageFolderPath, fileName);

            // Lưu hình ảnh vào thư mục
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadImageDTO.ImageFile.CopyToAsync(stream);
            }

            // Tạo URL cho hình ảnh đã lưu
            var imageUrl = $"/images/{fileName}";

            // Lưu vào cơ sở dữ liệu
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUploadImageForProduct", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Chỉ cần truyền đúng các tham số mà stored procedure yêu cầu
            command.Parameters.AddWithValue("@ProductID", uploadImageDTO.ProductID);
            command.Parameters.AddWithValue("@ImageURL", imageUrl);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();


            if (result != null)
            {
                responseDTO.Message = result.ToString();
                responseDTO.IsSuccess = true;
            }
            else
            {
                responseDTO.Message = "Tải hình ảnh không thành công.";
                responseDTO.IsSuccess = false;
            }
        }
        else
        {
            responseDTO.Message = "Không có tệp nào được tải lên.";
            responseDTO.IsSuccess = false;
        }

        return responseDTO;
    }

    public async Task<IEnumerable<ImageDTO>> GetAllImagesAsync()
    {
        var images = new List<ImageDTO>();

        using var connection = _connectionFactory.CreateConnection();
        using var command = SqlCommandFactory.CreateStoredProcedureCommand("spGetAllImages", connection);
      

        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            images.Add(new ImageDTO
            {
                ImageID = reader.GetInt32(0), // ID của hình ảnh
                ProductID = reader.GetInt32(1), // ID của sản phẩm liên quan
                ImageURL = reader.GetString(2),
                ProductName = reader.GetString(3)
            });
        }

        return images;
    }


    public async Task<DeleteImageResponseDTO> DeleteImageAsync(int imageID)
    {
        DeleteImageResponseDTO responseDTO = new DeleteImageResponseDTO();

        using var connection = _connectionFactory.CreateConnection();
        using var command = SqlCommandFactory.CreateStoredProcedureCommand("spDeleteImage", connection);
      

        command.Parameters.AddWithValue("@ImageID", imageID);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync(); // Sử dụng ExecuteScalar để lấy thông điệp kết quả

        if (result != null)
        {
            responseDTO.Message = result.ToString();
            responseDTO.IsDeleted = true;
        }
        else
        {
            responseDTO.Message = "Hình ảnh không tồn tại.";
            responseDTO.IsDeleted = false;
        }

        return responseDTO;
    }

}
