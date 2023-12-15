
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class AlertDto
    {

        public string language { get; set; }

        public string eventType { get; set; }

        public string severity { get; set; }

        public string certainty { get; set; }

        public string onset { get; set; }

        public string? expires { get; set; }

        public string description { get; set; }

        public string instruction { get; set; }

        public List<int> cisorps { get; set; }

    }
}