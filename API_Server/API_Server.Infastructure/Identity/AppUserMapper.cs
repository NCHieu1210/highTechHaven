using API_Server.Domain.Entities;
using API_Server.Infastructure.Identity.IdentityModels;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API_Server.Infastructure.Identity
{
    public class AppUserMapper : Profile
    {
        public AppUserMapper()
        {
            CreateMap<ApplicationUser, User>();
            CreateMap<User, ApplicationUser>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
