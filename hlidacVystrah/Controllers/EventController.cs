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

        // GET api/event/list/{updateId}
        [HttpGet("list/{updateId}")]
        public EventListResponse Get(int updateId)
        {
            return _eventService.GetEvents(updateId);
        }        

        // POST api/event/list/update
        [HttpGet("list/update")]
        public ParseResponse Update([FromQuery] string token)
        {
            return _eventService.UpdateEvents(token);
        }

    }
}
