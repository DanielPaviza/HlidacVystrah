using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface IEventsService
    {
        EventListResponse GetEvents();

        ParseResponse UpdateEvents();

        EventDetailResponse GetEventDetail(int id);
    }
}
