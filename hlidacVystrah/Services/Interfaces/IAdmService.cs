using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;
using Microsoft.AspNetCore.Mvc;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IAdmService
    {
        LogsResponse GetLogs(LogsDto data);

        LogsFilterOptionsResponse GetLogsFilterOptions(LoginTokenDto data);

        BaseResponse TokenLogin([FromBody] LoginTokenDto data);
    }
}
