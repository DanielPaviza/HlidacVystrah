using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;

namespace hlidacVystrah.Services
{

    public class EventsService : MasterService
    {

        private string? dataTimestamp = null;
        private ParseService _parseService;

        public EventsService(AppDbContext context, ParseService parseService) : base(context)
        {
            _context = context;
            _parseService = parseService;
        }

        public EventsResponse GetAlerts() {

            List<EventDto> alerts = new();

            return new EventsResponse
            {
                ResponseCode = 200,
                DataTimestamp = dataTimestamp,
                Events = alerts
            };
        }

        public ParseResponse UpdateAlerts(string? authToken) {

            if (!this.ValidateToken(authToken))
                return new ParseResponse { ResponseCode = StatusCodes.Status401Unauthorized };

            return _parseService.UpdateAlerts();
        }

        private bool ValidateToken(string? token) {

            return true;
        }
    }
}