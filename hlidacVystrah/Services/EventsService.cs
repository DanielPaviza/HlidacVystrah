using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Http;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Services
{

    public class EventsService : MasterService, IEventsService
    {

        private IParseService _parseService;

        public EventsService(AppDbContext context, IParseService parseService) : base(context)
        {
            _context = context;
            _parseService = parseService;
        }

        private DateTimeOffset ParseOffsetTime(string timestamp) {
           return DateTimeOffset.Parse(timestamp);
        }

        public EventListResponse GetEvents() {

            List<EventDto> events = new();
            UpdateTable? lastUpdate;

            try
            {

               lastUpdate = _context.Update.FirstOrDefault();
                if (lastUpdate == null)
                    return new EventListResponse { ResponseCode = StatusCodes.Status200OK };

                List<IGrouping<int, EventLocalityTable>> eventsGrouped = _context.EventLocality.Where(
                        el => el.id_update == lastUpdate.id
                    ).GroupBy(el => el.id_event).ToList();

                foreach (var _event in eventsGrouped)
                {

                    EventTable eventTable = _context.Event.Where(el => el.id == _event.Key).First();
                    EventDto eventDto = new EventDto
                    {
                        EventType = _context.EventType.Where(el => el.id == eventTable.id_event_type).First().name,
                        Severity = _context.Severity.Where(el => el.id == eventTable.id_severity).First().text,
                        Certainty = _context.Certainity.Where(el => el.id == eventTable.id_certainity).First().text,
                        Onset = eventTable.onset,
                        Expires = eventTable.expires,
                        Description = eventTable.description,
                        Instruction = eventTable.instruction
                    };

                    foreach (var locality in _event)
                    {
                        eventDto.CisorpList.Add(locality.id_locality);
                    }

                    events.Add(eventDto);
                }

            } catch (Exception ex)
            {
                return new EventListResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new EventListResponse
            {
                ResponseCode = StatusCodes.Status200OK,
                DataTimestamp = lastUpdate.timestamp,
                Events = events
            };
        }

        public ParseResponse UpdateEvents() {

            /*
            if (!this.ValidateToken(authToken))
                return new ParseResponse { ResponseCode = StatusCodes.Status401Unauthorized };
            */

            return _parseService.UpdateEvents();
        }
    }
}