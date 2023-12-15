using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using hlidacVystrah.Services;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {

        EventsService _eventsService;

        public EventsController(EventsService eventsService)
        {
            _eventsService = eventsService;
        }

        // GET api/events
        [HttpGet]
        public EventsResponse Get()
        {
            return _eventsService.GetAlerts();
        }

        // POST api/events/update
        [HttpPost("update")]
        public ParseResponse Post([FromHeader] string? authToken)
        {
            return _eventsService.UpdateAlerts(authToken);
        }
    }
}
