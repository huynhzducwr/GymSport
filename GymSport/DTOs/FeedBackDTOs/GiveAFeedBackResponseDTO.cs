using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace GymSport.DTOs.FeedBackDTOs
{
    public class GiveAFeedBackResponseDTO
    {
        public int FeedBackID { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }

    }
}
