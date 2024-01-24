using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IAdmService
    {
        LogsResponse GetLogs(LogsDto data);
    }
}
