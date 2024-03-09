
using System.Xml.Linq;
using hlidacVystrah.Model.Dto;

namespace hlidacVystrah.Model.Response
{
    public class UpdateListResponse : BaseResponse
    {
       
        public List<UpdateDto> PriorUpdates { get; set; } = new();

        public UpdateDto CurrentUpdate { get; set; } = new();

        public List<UpdateDto> PosteriorUpdates { get; set; } = new();

    }
}