
using hlidacVystrah.Model;
using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace hlidacVystrah.Services
{

    public class AdmService : MasterService, IAdmService
    {
        private readonly ILogService _logService;

        public AdmService(AppDbContext context, ILogService logService) : base(context)
        {
            _context = context;
            _logService = logService;
        }

        public LogsResponse GetLogs(LogsDto data)
        {

            if(!_context.Admin.Any(a => a.token == data.LoginToken))
            {
                _logService.WriteInfo("AdmService GetLogs()", "unauthorized");
                return new LogsResponse { ResponseCode = StatusCodes.Status401Unauthorized };
            }
                

            if(data.PageSize < 1 || data.PageNumber < 1)
            {
                _logService.WriteError("AdmService GetLogs()", "pagesize or pagenumber is negative");
                return new LogsResponse { ResponseCode = StatusCodes.Status400BadRequest };
            }

            int allLogsCount = _context.Log.Count();
            int recordsToSkip = (data.PageNumber - 1) * data.PageSize;
            List<LogTable> paginatedLogs = _context.Log.OrderByDescending(log => log.timestamp)
                                     .Skip(recordsToSkip)
                                     .Take(data.PageSize)
                                     .ToList();

            _logService.WriteSuccess("AdmService GetLogs()", "success");
            return new LogsResponse { ResponseCode = StatusCodes.Status200OK, Logs = paginatedLogs, AllLogsCount = allLogsCount };
        }

    }
}
