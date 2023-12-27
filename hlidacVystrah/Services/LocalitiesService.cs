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
using System.Collections.Generic;

namespace hlidacVystrah.Services
{

    public class LocalitiesService : MasterService, ILocalitiesService
    {

        public LocalitiesService(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public LocalityListResponse GetLocalityList() {

            Dictionary<string, List<LocalityDto>> localityList = new();

            try {
                foreach (var region in _context.Region)
                {
                    localityList.Add(region.name, GetRegionLocalityList(region.id));
                }
            } catch (Exception ex)
            {
                return new LocalityListResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new LocalityListResponse { ResponseCode = StatusCodes.Status200OK, LocalityList = localityList };
        }

        private List<LocalityDto> GetRegionLocalityList(int regionId)
        {

            List<LocalityDto> list = _context.Locality.Where(saved =>
                saved.id_region == regionId
            ).Select(l => new LocalityDto
                {
                    Cisorp = l.id,
                    Name = l.name
                }
            ).ToList();

            return list;
        }

        public EventListResponse GetLocalityDetail(int cisorp)
        {

            List<EventDto> events = new();
            UpdateTable? lastUpdate;

            try {

                lastUpdate = _context.Update.FirstOrDefault();
                if (lastUpdate == null)
                    return new EventListResponse { ResponseCode = StatusCodes.Status200OK };

                List<int> eventIds = _context.EventLocality.Where(
                        el => el.id_update == lastUpdate.id &&
                        el.id_locality == cisorp
                    ).GroupBy(el => el.id_event).Select(_event => _event.Key).ToList();
                
                foreach (int id in eventIds)
                {
                    EventTable et = _context.Event.Where(el => el.id == id).First();
                    events.Add(new EventDto
                    {
                        EventType = _context.EventType.Where(el => el.id == et.id_event_type).First().name,
                        Severity = _context.Severity.Where(el => el.id == et.id_severity).First().text,
                        Certainty = _context.Certainity.Where(el => el.id == et.id_certainity).First().text,
                        Onset = et.onset,
                        Expires = et.expires,
                        Description = et.description,
                        Instruction = et.instruction
                    });
                }

            } catch
            {
                return new EventListResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new EventListResponse { ResponseCode = StatusCodes.Status200OK, Events = events, DataTimestamp = lastUpdate.timestamp };
        }
    }
}