using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;  //Dùng để đọc cấu hình từ file appsettings.json

namespace GymSport.Connection
{
    ////Factory Pattern: Lớp này tạo ra các đối tượng SqlConnection, giúp tách biệt logic tạo kết nối với SQL Server.
    //Ngăn chặn kế thừa (đảm bảo chỉ có một factory duy nhất). 
    public sealed class SqlConnectionFactory
    {
        //Tạo Singleton với Lazy<T>
        //Lazy<T> giúp trì hoãn việc tạo đối tượng đến khi nó thực sự cần thiết (Lazy Initialization).
        //_instance.Value chỉ tạo một đối tượng duy nhất của SqlConnectionFactory trong suốt vòng đời ứng dụng.

        private static readonly Lazy<SqlConnectionFactory> _instance =
            new(() => new SqlConnectionFactory());

        private readonly string _connectionString;

        private SqlConnectionFactory()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            _connectionString = configuration.GetConnectionString("Database");
        }

        public static SqlConnectionFactory Instance => _instance.Value;
        //Hàm tạo kết nối SQL Server
        public SqlConnection CreateConnection()
            => new SqlConnection(_connectionString);


    }
}