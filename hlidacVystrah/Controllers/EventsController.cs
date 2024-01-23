using Microsoft.AspNetCore.Mvc;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {

        IEventsService _eventsService;

        public EventsController(IEventsService eventsService)
        {
            _eventsService = eventsService;
        }

        // GET api/events
        [HttpGet]
        public EventListResponse Get()
        {
            return _eventsService.GetEvents();
        }        

        // POST api/events/update
        [HttpGet("update")]
        public ParseResponse Update()
        {
            return _eventsService.UpdateEvents();
        }

    }
}
