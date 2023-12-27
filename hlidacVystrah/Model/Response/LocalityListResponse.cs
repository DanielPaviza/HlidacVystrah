
using System.Xml.Linq;

namespace hlidacVystrah.Model.Response
{
    public class LocalityListResponse : BaseResponse
    {
        public Dictionary<string, List<LocalityDto>> LocalityList { get; set; } = new();

    }
}