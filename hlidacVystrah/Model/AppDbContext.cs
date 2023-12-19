
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace hlidacVystrah.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<EventLocalityTable> EventLocality { get; set; }
        public DbSet<EventTable> Event { get; set; }
        public DbSet<EventTypeTable> EventType { get; set; }
        public DbSet<LocalityTable> Locality { get; set; }
        public DbSet<RegionTable> Region { get; set; }
        public DbSet<SeverityTable> Severity { get; set; }
        public DbSet<CertainityTable> Certainity { get; set; }
        public DbSet<UpdateTable> Update { get; set; }
        public DbSet<UrgencyTable> Urgency { get; set; }

    }
}