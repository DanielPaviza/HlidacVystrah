
using hlidacVystrah.Model;

namespace hlidacVystrah.Services
{
    public class MasterService
    {

        internal AppDbContext _context;
        public MasterService(AppDbContext context)
        {
            _context = context;
        }
    }
}