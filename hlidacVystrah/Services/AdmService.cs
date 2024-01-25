
using hlidacVystrah.Model;
using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

        public BaseResponse TokenLogin([FromBody] LoginTokenDto data)
        {

            string LOG_NAME = "TokenLogin";

            try
            {

                UserTable user = _context.User.FirstOrDefault(u => u.login_token == data.LoginToken);
                int authorizeAdminStatusCode = this.AuthorizeUserAdminStatusCode(user);
                if (authorizeAdminStatusCode != 200)
                {
                    this._logService.WriteInfo($"Unauthorized access attempt.", LOG_NAME);
                    return new LogsFilterOptionsResponse { ResponseCode = authorizeAdminStatusCode };
                }

                _logService.WriteSuccessDev("ok", LOG_NAME);
                return new BaseResponse { ResponseCode = StatusCodes.Status200OK };

            } catch (Exception ex)
            {
                _logService.WriteError(ex.Message, LOG_NAME);
                return new BaseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }

        private int AuthorizeUserAdminStatusCode(UserTable? user)
        {
            if (user == null || !_context.Admin.Any(a => a.id_user == user.id))
                return StatusCodes.Status401Unauthorized;

            if (user.login_token_expire < DateTime.Now)
                return 440;

            return StatusCodes.Status200OK;
        }

        public LogsResponse GetLogs(LogsDto data)
        {

            string LOG_NAME = "GetLogs";

            try
            {

                UserTable user = _context.User.FirstOrDefault(u => u.login_token == data.LoginToken);
                int authorizeAdminStatusCode = this.AuthorizeUserAdminStatusCode(user);
                if (authorizeAdminStatusCode != 200)
                {
                    this._logService.WriteInfo($"Unauthorized access attempt.", LOG_NAME);
                    return new LogsResponse { ResponseCode = authorizeAdminStatusCode };
                }

                AdminTable admin = _context.Admin.First(a => a.id_user == user.id);

                LOG_NAME += $" - Admin {admin.name} ({admin.id})";

                if (data.PageSize < 1 || data.PageNumber < 1)
                {
                    _logService.WriteError("PageSize or PageNumber is negative.", LOG_NAME);
                    return new LogsResponse { ResponseCode = StatusCodes.Status400BadRequest };
                }

                if((data.FilterType != null && !_context.LogType.Any(lt => lt.id == data.FilterType)) || (data.FilterService != null && !_context.LogService.Any(ls => ls.id == data.FilterService)))
                {
                    _logService.WriteError("Invalid filter", LOG_NAME);
                    return new LogsResponse { ResponseCode = StatusCodes.Status400BadRequest };
                }

                List<LogTable> filteredLogs = _context.Log.Where(l =>
                    (data.FilterType == null || l.id_log_type == data.FilterType) &&
                    (data.FilterService == null || l.id_log_service == data.FilterService)
                ).ToList(); 

                int allLogsCount = filteredLogs.Count();
                int recordsToSkip = (data.PageNumber - 1) * data.PageSize;
                List<LogTable> paginatedLogs = filteredLogs.OrderByDescending(log => log.timestamp)
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

        public LogsFilterOptionsResponse GetLogsFilterOptions(LoginTokenDto data)
        {

            string LOG_NAME = "GetLogsFilterOptions";

            try
            {

                UserTable user = _context.User.FirstOrDefault(u => u.login_token == data.LoginToken);
                int authorizeAdminStatusCode = this.AuthorizeUserAdminStatusCode(user);
                if (authorizeAdminStatusCode != 200)
                {
                    this._logService.WriteInfo($"Unauthorized access attempt.", LOG_NAME);
                    return new LogsFilterOptionsResponse { ResponseCode = authorizeAdminStatusCode };
                }

                AdminTable admin = _context.Admin.First(a => a.id_user == user.id);

                LOG_NAME += $" - Admin {admin.name} ({admin.id})";

                List<LogTypeTable> logTypes = _context.LogType.ToList();
                List<LogServiceTable> logServices = _context.LogService.ToList();
                _logService.WriteSuccessDev("ok", LOG_NAME);

                return new LogsFilterOptionsResponse { ResponseCode = StatusCodes.Status200OK, LogServices = logServices, LogTypes = logTypes };
            }
            catch(Exception ex)
            {
                _logService.WriteError(ex.Message, LOG_NAME);
                return new LogsFilterOptionsResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }
    }
}
