using Microsoft.AspNetCore.Mvc;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {

        IEventService _eventService;

        public EventsController(IEventService eventsService)
        {
            _eventService = eventsService;
        }

        // GET api/events
        [HttpGet]
        public EventListResponse Get()
        {
            return _eventService.GetEvents();
        }        

        // POST api/events/update
        [HttpGet("update")]
        public ParseResponse Update()
        {
            return _eventService.UpdateEvents();
        }

    }
}
