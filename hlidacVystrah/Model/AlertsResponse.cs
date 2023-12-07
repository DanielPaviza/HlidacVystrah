using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class AlertsResponse
    {

        public int responseCode { get; set; }

        public string dataTimestamp { get; set; }

        public List<XElement> alerts { get; set; } = new();
    }
}