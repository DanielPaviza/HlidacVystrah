
using System.Xml.Linq;
using hlidacVystrah.Model.Dto;

namespace hlidacVystrah.Model.Response
{
    public class UserDto
    {

        public int Id {  get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
     }
}