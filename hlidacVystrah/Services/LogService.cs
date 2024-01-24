
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

        IWebHostEnvironment _enviroment;
        private string session;
        public string Service { get; set; } = "LogService";

        public LogService(AppDbContext context, IWebHostEnvironment enviroment) : base(context)
        {
            _context = context;
            session = this.GenerateSessionNumber();
            _enviroment = enviroment;
        }

        private async Task Write(string logType, string text, string name)
        {
            _context.Log.Add(new LogTable { id_log_type = logType, name = name, text = text, session = this.session });
            _context.SaveChangesAsync();
        }

        public void WriteInfo(string text, string name) {
            this.Write("Info", text, name);
        }

        public void WriteError(string text, string name) {
            this.Write("Error", text, name);
        }

        public void WriteSuccess(string text, string name) {
            this.Write("Success", text, name);
        }

        public void WriteSuccessDev(string text, string name)
        {
            if(_enviroment.IsDevelopment())
                this.Write("Success", text, name);
        }

        public void WriteInfoDev(string text, string name)
        {
            if (_enviroment.IsDevelopment())
                this.Write("Info", text, name);
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
