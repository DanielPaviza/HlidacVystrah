
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class ParseResponse
    {

        public int responseCode { get; set; }

        public UpdateCount count { get; set; } = new();
    }
}