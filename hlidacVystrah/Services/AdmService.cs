
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
            _logService.Service = "AdmService";
        }

        public LogsResponse GetLogs(LogsDto data)
        {

            string LOG_NAME = "GetLogs";

            try
            {
                AdminTable admin = _context.Admin.FirstOrDefault(a => a.token == data.LoginToken);
                if(admin == null)
                {
                    _logService.WriteInfo($"Unauthorized access attempt.", LOG_NAME);
                    return new LogsResponse { ResponseCode = StatusCodes.Status401Unauthorized };
                }

                LOG_NAME += $" - Admin {admin.id}";

                if (data.PageSize < 1 || data.PageNumber < 1)
                {
                    _logService.WriteError("PageSize or PageNumber is negative.", LOG_NAME);
                    return new LogsResponse { ResponseCode = StatusCodes.Status400BadRequest };
                }

                int allLogsCount = _context.Log.Count();
                int recordsToSkip = (data.PageNumber - 1) * data.PageSize;
                List<LogTable> paginatedLogs = _context.Log.OrderByDescending(log => log.timestamp)
                                         .Skip(recordsToSkip)
                                         .Take(data.PageSize)
                                         .ToList();

                List<string> serviceNames = _context.LogService.ToList().Select(ls => ls.id).ToList();
                List<string> logTypes = _context.LogType.ToList().Select(lt => lt.id).ToList();

                _logService.WriteSuccessDev("ok", LOG_NAME);
                return new LogsResponse
                {
                    ResponseCode = StatusCodes.Status200OK,
                    Logs = paginatedLogs,
                    AllLogsCount = allLogsCount,
                    ServiceNames = serviceNames,
                    LogTypes = logTypes
                };
            }
            catch (Exception ex)
            {
                _logService.WriteError(ex.Message, LOG_NAME);
                return new LogsResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }
    }
}
