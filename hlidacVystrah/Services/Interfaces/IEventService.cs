using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IEventService
    {
        EventListResponse GetEvents(int? updateId = null);

        ParseResponse UpdateEvents(string token);
    }
}
