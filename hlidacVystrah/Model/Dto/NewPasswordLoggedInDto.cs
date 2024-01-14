
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace hlidacVystrah.Model.Dto
{
    public class NewPasswordLoggedInDto
    {
        public string Password {  get; set; }

        public string LoginToken { get; set; }

    }
}