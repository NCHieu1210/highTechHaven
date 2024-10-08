using API_Server.Domain.IExternalServices;
using API_Server.Domain.Models;
using API_Server.Infastructure.ConfigureSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Server.Infastructure.ExternalServices
{
    public class VnPayService : IVnPayService
    {
        private readonly VnPaySettings _vnPaySettings;

        public VnPayService(IOptions<VnPaySettings> vnPaySettings) {
            _vnPaySettings = vnPaySettings.Value;
        }
        public string CreatePaymentUrl(string context, VnPayRequiredModel model)
        {
            var tick = DateTime.Now.Ticks.ToString();
            var Price = (long)model.Amount * 100;
            var vnpay = new VnPayLibrary();
              
            vnpay.AddRequestData("vnp_Version", _vnPaySettings.Version);
            vnpay.AddRequestData("vnp_Command", _vnPaySettings.Command);
            vnpay.AddRequestData("vnp_TmnCode", _vnPaySettings.TmnCode);
            vnpay.AddRequestData("vnp_Amount", Price.ToString());
            /*Số tiền thanh toán. Số tiền không 
            mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND
            (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần(khử phần thập phân), sau đó gửi sang VNPAY
            là: 10000000*/
            vnpay.AddRequestData("vnp_CreateDate", model.CreateDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _vnPaySettings.CurrCode);
            vnpay.AddRequestData("vnp_IpAddr", context);
            vnpay.AddRequestData("vnp_Locale", _vnPaySettings.Locale);

            vnpay.AddRequestData("vnp_OrderInfo", "Khách hàng: " + model.FullName);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", _vnPaySettings.PaymentBackReturnUrl);
            vnpay.AddRequestData("vnp_ExpireDate", model.ExpireDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_TxnRef", tick);
            /*Mã tham chiếu của giao dịch tại hệ 
            thống của merchant.Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.Không được
            trùng lặp trong ngày*/

            string secretKey = _vnPaySettings.HashSecret;
            var paymentUrl = vnpay.CreateRequestUrl(_vnPaySettings.BaseURL, secretKey);

            return paymentUrl;
        }

        public VnPaymentResponseModel PaymentExcute(IDictionary<string, string> collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key,value) in collections) { 
                if(!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }    
            }

            var vnp_orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_ResponseCode");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, "5L1CRQ7J3WQYOPTV52XT8JK9BJ7RTEX0");
            if(!checkSignature)
            {
                return new VnPaymentResponseModel
                {
                    Success = false,
                    PaymentMethod = "VnPay",
                    OrderDescription = vnp_OrderInfo,
                    TransactionId = vnp_TransactionId.ToString(),
                    Token = vnp_SecureHash,
                    VnPayResponseCode = vnp_ResponseCode,
                };
            }
            return new VnPaymentResponseModel
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription= vnp_OrderInfo,
                TransactionId = vnp_TransactionId.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode,
            };
        }
    }
}
