
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace hlidacVystrah.Model
{

    [Table("dpc")]
    public class DpcTable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        public int id_event_type { get; set; }

        public int id_severity { get; set; }

        public int id_certainity { get; set; }

        public int id_area { get; set; }

        public bool isRegion { get; set; }
    }
}