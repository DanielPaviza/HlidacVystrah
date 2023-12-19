using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface ILocalitiesService
    {
        LocalityListResponse GetLocalityList();

        EventListResponse GetLocalityDetail(int cisorp);
    }
}
