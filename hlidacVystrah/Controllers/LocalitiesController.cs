using Microsoft.AspNetCore.Mvc;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalitiesController : ControllerBase
    {

        ILocalitiesService _localitiesService;

        public LocalitiesController(ILocalitiesService localitiesService)
        {
            _localitiesService = localitiesService;
        }

        // GET api/localities
        [HttpGet]
        public LocalityListResponse Get()
        {
            return _localitiesService.GetLocalityList();
        }

        // GET api/localities/{id}
        [HttpGet("{id}")]
        public LocalityDetailResponse Get(int id)
        {
            return _localitiesService.GetLocalityDetail(id);
        }

    }
}
