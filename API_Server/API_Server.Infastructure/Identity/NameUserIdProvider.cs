using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Identity
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            // Lấy UserID từ JWT Token thông qua Claim
            return connection.User?.FindFirst("UserID")?.Value;
        }
    }
}
