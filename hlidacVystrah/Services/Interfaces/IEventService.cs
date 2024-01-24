using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IEventService
    {
        EventListResponse GetEvents();

        ParseResponse UpdateEvents();
    }
}
