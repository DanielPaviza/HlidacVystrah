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
        public EventListResponse GetEvents([FromQuery] string? timestamp = null)
        {
            return _eventService.GetEvents(timestamp);
        }

        // POST api/event/list/update
        [HttpGet("list/update")]
        public ParseResponse Update([FromQuery] string token)
        {
            return _eventService.UpdateEvents(token);
        }

    }
}
