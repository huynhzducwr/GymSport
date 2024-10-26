using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Payment.Application.Base.Models;
using Payment.Application.Constants;
using Payment.Application.Features.Dtos;
using Payment.Application.Interface;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Payment.Service.Momo.Config;
using Payment.Service.Momo.Request;
using Payment.Ultils.Extensions;


namespace Payment.Application.Features.Commands
{
    public class CreatePayment : IRequest<BaseResultWithData<PaymentLinkDtos>>
    {
        public string PaymentContent { get; set; } = string.Empty;
        public string PaymentCurrency { get; set; } = string.Empty;
        public string PaymentRefId { get; set; } = string.Empty;
        public decimal? RequiredAmount { get; set; }
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public DateTime? PaymentDate { get; set; } = DateTime.Now;
        public DateTime? ExpireDate { get; set; } = DateTime.Now.AddMinutes(15);
        public string? PaymentLanguage { get; set; } = string.Empty;
        public string? MerchantId { get; set; } = string.Empty;
        public string? PaymentDestinationId { get; set; } = string.Empty;
        public string? Signature { get; set; } = string.Empty;
    }

    public class CreatePaymentHandler : IRequestHandler<CreatePayment, BaseResultWithData<PaymentLinkDtos>>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IConnectionService connectionService;
        private readonly ISqlService sqlService;

        private readonly MomoConfig momoConfig;

 
        public CreatePaymentHandler(ICurrentUserService currentUserService,
            IConnectionService connectionService,
            ISqlService sqlService,
            IOptions<MomoConfig> momoConfigOptions)

        {
            this.currentUserService = currentUserService;
            this.connectionService = connectionService;
            this.sqlService = sqlService;

            this.momoConfig = momoConfigOptions.Value;

        }
        public Task<BaseResultWithData<PaymentLinkDtos>> Handle(
            CreatePayment request, CancellationToken cancellationToken)
        {
            var result = new BaseResultWithData<PaymentLinkDtos>();

            try
            {
                string connectionString = connectionService.Datebase ?? string.Empty;
                var outputIdParam = sqlService.CreateOutputParameter("@InsertedId", SqlDbType.NVarChar, 50);
                var paramters = new SqlParameter[]
                {
                    new SqlParameter("@Id", DateTime.Now.Ticks.ToString()),
                    new SqlParameter("@PaymentContent", request.PaymentContent),
                    new SqlParameter("@PaymentCurrency", "VND"),
                    new SqlParameter("@PaymentRefId", request.PaymentRefId ?? string.Empty),
                    new SqlParameter("@RequiredAmount", request.RequiredAmount ?? 0),
                    new SqlParameter("@OrderID", request.OrderID),
                    new SqlParameter("@UserID", request.UserID),
                    new SqlParameter("@PaymentDate", DateTime.Now),
                    new SqlParameter("@ExpireDate", DateTime.Now.AddMinutes(15)),
                    new SqlParameter("@PaymentLanguage", "vn"),
                    new SqlParameter("@Signature", "ORD1234"),
                    new SqlParameter("@MerchantId", request.MerchantId ?? string.Empty),
                    new SqlParameter("@PaymentDestinationId", request.PaymentDestinationId ?? string.Empty),
                    new SqlParameter("@InsertUser", request.UserID),
                    outputIdParam,
                };

                (int affectedRows, string sqlError) = sqlService.ExecuteNonQuery(connectionString,
                    PaymentConstants.InsertSprocName, paramters);

                if (affectedRows > 1)
                {
                    var paymentUrl = string.Empty;

                    switch (request.PaymentDestinationId)
                    {
                       
                        case "MOMO":
                            var momoOneTimePayRequest = new MomoOneTimePaymentRequest(momoConfig.PartnerCode,
                                outputIdParam!.Value?.ToString() ?? string.Empty, (long)request.RequiredAmount!, outputIdParam!.Value?.ToString() ?? string.Empty,
                                request.PaymentContent ?? string.Empty, momoConfig.ReturnUrl, momoConfig.IpnUrl, "captureWallet",
                                string.Empty);
                            momoOneTimePayRequest.MakeSignature(momoConfig.AccessKey, momoConfig.SecretKey);
                            (bool createMomoLinkResult, string? createMessage) = momoOneTimePayRequest.GetLink(momoConfig.PaymentUrl);
                            if (createMomoLinkResult)
                            {
                                paymentUrl = createMessage;
                            }
                            else
                            {
                                result.Message = createMessage;
                            }
                            break;
                       
                        default:
                            break;
                    }

                    result.Set(true, MessageContants.OK, new PaymentLinkDtos()
                    {
                        PaymentId = outputIdParam!.Value?.ToString() ?? string.Empty,
                        PaymentUrl = paymentUrl,
                    });
                }
                else
                {
                    result.Set(false, MessageContants.Error);
                    result.Errors.Add(new BaseError()
                    {
                        Code = "Sql",
                        Message = sqlError
                    });
                }
            }
            catch (Exception ex)
            {
                result.Set(false, MessageContants.Error);
                result.Errors.Add(new BaseError()
                {
                    Code = MessageContants.Exception,
                    Message = ex.Message,
                });
            }

            return Task.FromResult(result);
        }
    }
}
