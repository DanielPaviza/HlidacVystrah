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
using Microsoft.EntityFrameworkCore;
using System.Linq;
using hlidacVystrah.Model.Dto;

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

        private string TimestampToReadable(string? timestamp) {

            if (timestamp == null)
                return null;

            DateTimeOffset localTime = DateTimeOffset.Parse(timestamp);
            string readable = localTime.ToString();

            //today
            if (localTime.Date == DateTimeOffset.Now.Date)
                return $"Dnes v {readable.Split(' ')[1]}";

            return $"{readable.Split(' ')[0]} {readable.Split(' ')[1]}"; ;
        }

        public EventListResponse GetEvents() {

            List<EventDto> events = new();
            UpdateTable? lastUpdate;

            try
            {

               lastUpdate = _context.Update.OrderByDescending(u => u.id).FirstOrDefault();

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
                        Id = _event.Key,
                        EventType = _context.EventType.Where(el => el.id == eventTable.id_event_type).First().name,
                        Severity = _context.Severity.Where(el => el.id == eventTable.id_severity).First().text,
                        Certainty = _context.Certainty.Where(el => el.id == eventTable.id_certainty).First().text,
                        Urgency = _context.Urgency.Where(el => el.id == eventTable.id_urgency).First().text,
                        Onset = TimestampToReadable(eventTable.onset),
                        Expires = TimestampToReadable(eventTable.expires),
                        Description = eventTable.description,
                        Instruction = eventTable.instruction,
                        ImgPath = _context.EventType.Where(el => el.id == eventTable.id_event_type).First().img_path
                    };

                    List<int> cisorps = new();
                    foreach (var locality in _event)
                    {
                        cisorps.Add(locality.id_locality);
                    }

                    Dictionary<string, List<LocalityDto>> localitiesGrouped = _context.Locality.Where(
                        el => cisorps.Contains(el.id)
                    ).GroupBy(el => _context.Region.First(r => r.id == el.id_region).name).ToList().ToDictionary(
                        group => group.Key,
                        group => group.Select(locality => new LocalityDto
                        {
                            Cisorp = locality.id,
                            Name = locality.name
                        }).ToList()
                    );

                    eventDto.LocalityList = localitiesGrouped;

                    events.Add(eventDto);
                }

                // order by severity id
                events = events.OrderByDescending(e => _context.Severity.First(s => s.text == e.Severity).id).ToList();

            } catch (Exception ex)
            {
                return new EventListResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new EventListResponse
            {
                ResponseCode = StatusCodes.Status200OK,
                DataTimestamp = TimestampToReadable(lastUpdate.timestamp),
                Events = events
            };
        }

        public EventDetailResponse GetEventDetail(int id)
        {

            EventTable? eventTable = _context.Event.FirstOrDefault(el => el.id == id);
            if (eventTable == null)
                return new EventDetailResponse { ResponseCode = StatusCodes.Status404NotFound };

            try
            {
                EventDto eventDto = EventTableToDto(eventTable);
                string timestamp = _context.Update.First(
                        update => update.id == _context.EventLocality.First(el => el.id_event == eventDto.Id).id_update
                    ).timestamp;

                return new EventDetailResponse
                {
                    ResponseCode = StatusCodes.Status200OK,
                    DataTimestamp = timestamp,
                    Event = eventDto
                };
            } catch (Exception ex)
            {
                return new EventDetailResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }

        private EventDto EventTableToDto(EventTable et)
        {
            return new EventDto
            {
                Id = et.id,
                EventType = _context.EventType.Where(el => el.id == et.id_event_type).First().name,
                Severity = _context.Severity.Where(el => el.id == et.id_severity).First().text,
                Certainty = _context.Certainty.Where(el => el.id == et.id_certainty).First().text,
                Urgency = _context.Urgency.Where(el => el.id == et.id_urgency).First().text,
                Onset = et.onset,
                Expires = et.expires,
                Description = et.description,
                Instruction = et.instruction,
                ImgPath = _context.EventType.Where(el => el.id == et.id_event_type).First().img_path
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