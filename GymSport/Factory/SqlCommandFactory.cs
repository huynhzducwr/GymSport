using System.Data;
using Microsoft.Data.SqlClient;
namespace GymSport.Factory
{
    public static class SqlCommandFactory
    {
        public static SqlCommand CreateStoredProcedureCommand(string procedureName, SqlConnection connection)
        {
            return new SqlCommand(procedureName, connection) { CommandType = CommandType.StoredProcedure };
        }
    }
}
