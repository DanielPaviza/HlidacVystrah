
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class ParseResponse
    {

        public int ResponseCode { get; set; }

        public UpdateCount Count { get; set; } = new();
    }
}