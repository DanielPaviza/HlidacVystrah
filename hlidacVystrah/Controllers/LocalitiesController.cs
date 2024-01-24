using Microsoft.AspNetCore.Mvc;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalitiesController : ControllerBase
    {

        ILocalityService _localityService;

        public LocalitiesController(ILocalityService localitiesService)
        {
            _localityService = localitiesService;
        }

        // GET api/localities
        [HttpGet]
        public LocalityListResponse Get()
        {
            return _localityService.GetLocalityList();
        }

        // GET api/localities/{id}
        [HttpGet("{id}")]
        public LocalityDetailResponse Get(int id)
        {
            return _localityService.GetLocalityDetail(id);
        }

    }
}
