
using System.Xml.Linq;

namespace hlidacVystrah.Model.Response
{
    public class EventDetailResponse : BaseResponse
    {
        public string? DataTimestamp { get; set; } = null;

        public EventDto Event { get; set; } = new();

    }
}