
using hlidacVystrah.Model;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Model.Dto;

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

        public LocalityDetailResponse GetLocalityDetail(int id)
        {

            List<EventDto> events = new();
            UpdateTable? lastUpdate;

            try {

                LocalityTable? locality = _context.Locality.FirstOrDefault(l => l.id == id);
                if (locality == null)
                    return new LocalityDetailResponse { ResponseCode = StatusCodes.Status400BadRequest };

                string? localityName = locality.name;
                string regionName = _context.Region.First(r => r.id == locality.id_region).name;

                lastUpdate = _context.Update.FirstOrDefault();
                if (lastUpdate == null)
                    return new LocalityDetailResponse { ResponseCode = StatusCodes.Status200OK };

                List<int> eventIds = _context.EventLocality
                    .Join(
                        _context.Event,
                        el => el.id_event,
                        e => e.id,
                        (el, e) => new { EventLocality = el, Event = e }
                    )
                    .Where(joined => 
                        joined.Event.id_update == lastUpdate.id &&
                        joined.EventLocality.id_locality == id
                    )
                    .Select(joined => joined.Event.id)
                    .ToList();

                foreach (int eventId in eventIds)
                {
                    EventTable et = _context.Event.Where(el => el.id == eventId).First();
                    events.Add(new EventDto
                    {
                        Id = null,
                        EventType = _context.EventType.Where(el => el.id == et.id_event_type).First().name,
                        Severity = _context.Severity.Where(el => el.id == et.id_severity).First().text,
                        Certainty = _context.Certainty.Where(el => el.id == et.id_certainty).First().text,
                        Onset = et.onset,
                        Expires = et.expires,
                        Description = et.description,
                        Instruction = et.instruction
                    });
                }

                return new LocalityDetailResponse { ResponseCode = StatusCodes.Status200OK, Events = events, DataTimestamp = lastUpdate.timestamp, LocalityName = localityName, RegionName = regionName };

            }
            catch
            {
                return new LocalityDetailResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }
    }
}