
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class AlertsResponse
    {

        public int responseCode { get; set; }

        public string? dataTimestamp { get; set; } = null;

        public List<AlertDto> alerts { get; set; } = new();
    }
}