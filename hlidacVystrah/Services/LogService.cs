
using hlidacVystrah.Model;
using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace hlidacVystrah.Services
{

    public class LogService : MasterService, ILogService
    {

        private string session;

        public LogService(AppDbContext context) : base(context)
        {
            _context = context;
            session = this.GenerateSessionNumber();
        }

        private async Task Write(string logType, string location, string text)
        {
            _context.Log.Add(new LogTable { id_log_type = logType, location = location, text = text, session = this.session });
            _context.SaveChangesAsync();
        }

        public void WriteInfo(string location, string text) {
            this.Write("Info", location, text);
        }
        
        public void WriteError(string location, string text) {
            this.Write("Error", location, text);
        }

        public void WriteSuccess(string location, string text) {
            this.Write("Success", location, text);
        }

        private string GenerateSessionNumber(int length = 32)
        {
            byte[] randomBytes = new byte[length];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

    }
}
