
using System.Xml.Linq;

namespace hlidacVystrah.Model.Response
{
    public class EventListResponse : BaseResponse
    {
        public string? DataTimestamp { get; set; } = null;

        public List<EventDto> Events { get; set; } = new();

    }
}