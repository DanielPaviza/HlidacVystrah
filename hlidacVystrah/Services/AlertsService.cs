using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;

namespace hlidacVystrah.Services
{

    public class AlertsService : MasterService
    {

        private string? dataTimestamp = null;
        private ParseService _parseService;

        public AlertsService(AppDbContext context, ParseService parseService) : base(context)
        {
            _context = context;
            _parseService = parseService;
        }

        public AlertsResponse GetAlerts(string language) {

            List<AlertDto> alerts = new();

            return new AlertsResponse
            {
                responseCode = 200,
                dataTimestamp = dataTimestamp,
                alerts = alerts
            };
        }

        public ParseResponse UpdateAlerts(string? authToken) {

            if (!this.ValidateToken(authToken))
                return new ParseResponse { responseCode = StatusCodes.Status401Unauthorized };

            return _parseService.UpdateAlerts();
        }

        private bool ValidateToken(string? token) {

            return true;
        }
    }
}