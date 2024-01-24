using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface ILogService
    {
        void WriteInfo(string location, string text);
        void WriteError(string location, string text);
        void WriteSuccess(string location, string text);
    }
}
