using hlidacVystrah.Model.Response;

namespace hlidacVystrah.Services.Interfaces
{
    public interface ILocalitiesService
    {
        LocalityListResponse GetLocalityList();

        LocalityDetailResponse GetLocalityDetail(int id);
    }
}
