
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class AlertsResponse
    {

        public int ResponseCode { get; set; }

        public string? DataTimestamp { get; set; } = null;

        public List<AlertDto> Events { get; set; } = new();
    }
}