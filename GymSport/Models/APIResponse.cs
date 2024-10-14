using System.Net;
namespace GymSport.Models
{
 
        public class APIResponse<T>
        {
            public bool Success { get; set; }
            public HttpStatusCode StatusCode { get; set; }
            public string Message { get; set; }
            public T Data { get; set; }
            public object Error { get; set; }
        
            //api cho thong bao thanh cong
            public APIResponse(T data, string message = "", HttpStatusCode statusCode = HttpStatusCode.OK)
            {
                Success = true;
                StatusCode = statusCode;
                Message = message;
                Data = data;
                Error = null;
            }

            //API cho thong bao loi
            public APIResponse(HttpStatusCode statusCode, string message, object error = null)
            {
                Success = false;
                StatusCode = statusCode;
                Message = message;
                Data = default(T);
                Error = error;

            }
        public APIResponse(HttpStatusCode statusCode, T data, string message = null)
        {
            StatusCode = statusCode;
            Data = data;
            Message = message;
        }
    }
   
}
