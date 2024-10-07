using Microsoft.Data.SqlClient;

namespace GymSport.Extensions
{
    public static class DataReaderExtensions
    {
        public static T GetValueByColumn<T>(this SqlDataReader reader, string columnName)
        {
            int index = reader.GetOrdinal(columnName);

           
            if (!reader.IsDBNull(index))
            {
              
                return (T)reader[index];
            }

            return default(T);
        }
    }
}
