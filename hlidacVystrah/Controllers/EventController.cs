using Microsoft.AspNetCore.Mvc;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {

        IEventService _eventService;

        public EventController(IEventService eventsService)
        {
            _eventService = eventsService;
        }

        // GET api/event/list
        [HttpGet("list")]
        public EventListResponse Get()
        {
            return _eventService.GetEvents();
        }        

        // POST api/event/list/update
        [HttpGet("update")]
        public ParseResponse Update()
        {
            return _eventService.UpdateEvents();
        }

    }
}
