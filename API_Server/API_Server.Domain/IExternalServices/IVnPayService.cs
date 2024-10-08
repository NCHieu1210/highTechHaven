using API_Server.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Domain.IExternalServices
{
    public interface IVnPayService
    {
        public string CreatePaymentUrl(string context, VnPayRequiredModel model);
        public VnPaymentResponseModel PaymentExcute(IDictionary<string, string> collections);
    }
}
