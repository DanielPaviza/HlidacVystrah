using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using hlidacVystrah.Services;

namespace hlidacVystrah.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlertsController : ControllerBase
    {

        AlertsService _alertsService;

        public AlertsController(AlertsService alertsService)
        {
            _alertsService = alertsService;
        }

        // GET api/alerts/en
        [HttpGet("{language}")]
        public AlertsResponse Get(string language)
        {
            return _alertsService.GetAlerts(language);
        }

        // POST api/alerts/update
        [HttpPost("update")]
        public ParseResponse Post([FromHeader] string? authToken)
        {
            return _alertsService.UpdateAlerts(authToken);
        }
    }
}
