
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class EventsResponse
    {

        public int ResponseCode { get; set; }

        public string? DataTimestamp { get; set; } = null;

        public List<EventDto> Events { get; set; } = new();
    }
}