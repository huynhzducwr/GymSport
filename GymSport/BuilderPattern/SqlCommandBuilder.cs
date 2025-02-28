
using System.Data;
using System.Data.SqlClient;
namespace GymSport.BuilderPattern
{
    public class SqlCommandBuilder
    {
        private readonly SqlCommand _command;

        public SqlCommandBuilder(string procedureName, SqlConnection connection)
        {
            _command = new SqlCommand(procedureName, connection) { CommandType = CommandType.StoredProcedure };
        }

        public SqlCommandBuilder AddParameter(string name, object value)
        {
            _command.Parameters.AddWithValue(name, value ?? DBNull.Value);
            return this;
        }

        public SqlCommandBuilder AddOutputParameter(string name, SqlDbType type, int size = 0)
        {
            var param = new SqlParameter(name, type) { Direction = ParameterDirection.Output };
            if (size > 0) param.Size = size;
            _command.Parameters.Add(param);
            return this;
        }

        public SqlCommand Build() => _command;
    }
}
