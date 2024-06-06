
using hlidacVystrah.Model;
using hlidacVystrah.Model.Dto;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using static System.Net.Mime.MediaTypeNames;

namespace hlidacVystrah.Services
{

    public class LogService : MasterService, ILogService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _enviroment;
        private string session;

        public string Service { get; set; } = "LogService";


        public LogService(IWebHostEnvironment enviroment, AppDbContext context, IHttpContextAccessor httpContextAccessor) : base(context)
        {
            _httpContextAccessor = httpContextAccessor;
            session = this.GenerateSessionNumber();
            _enviroment = enviroment;
            _context = context;
        }

        private void Write(string logType, string text, string name)
        {

            try
            {
                string? clientInfoString = null;
                var httpContext = _httpContextAccessor.HttpContext;

                if (httpContext != null)
                    clientInfoString = httpContext.Request.Headers["User-Agent"].ToString();

                _context.Log.Add(
                    new LogTable
                    {
                        id_log_type = logType,
                        id_log_service = this.Service,
                        name = name,
                        text = text,
                        client_info = clientInfoString,
                        session = this.session
                    }
                );
                _context.SaveChanges();
            } catch( Exception ex ) {
                //this.Write("Error", ex.Message, "Log write");
            }      
        }

        public BaseResponse RemoveLogs(List<LogTable> logs)
        {

            string LogName = "RemoveLogs";

            this.WriteInfo("Db logs delete old start", LogName);
            this.WriteInfo($"Log delete count: {logs.Count}", LogName);

            try
            {
                _context.Log.RemoveRange(logs);       
                _context.SaveChanges();
                this.WriteSuccess("Db logs delete old success", LogName);
                return new BaseResponse { ResponseCode = 200 };
            }
            catch (Exception ex)
            {
                this.WriteError(ex.Message, LogName);
                return new BaseResponse { ResponseCode = 500 };
            }
        }

        public BaseResponse BackUpToFile(List<LogTable> logs)
        {

            string LogName = "BackUpToFile";

            this.WriteInfo("Db logs to file backup start", LogName);
            this.WriteInfo($"Logs to backup: ${logs.Count}", LogName);

            try
            {

                // Ensure the /logs directory exists
                string logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
                if (!Directory.Exists(logDirectory))
                    Directory.CreateDirectory(logDirectory);

                // Generate the log file path with a timestamp in the filename
                string logFilePath = Path.Combine(logDirectory, $"log_backup_{DateTime.Now:dd_MM_yyyy}.txt");

                // Write logs to the file
                using (StreamWriter writer = new StreamWriter(logFilePath))
                {

                    // FIRST ROW
                    writer.WriteLine($"Timestamp | ID | Type | Service | Name | Text | Session | Client Info");

                    foreach (var log in logs)
                    {
                        writer.WriteLine($"{log.timestamp} | {log.id} | {log.id_log_type} | {log.id_log_service} | {log.name} | {log.text} | {log.session} | {log.client_info}");
                    }
                }

                this.WriteSuccess("Db logs to file backup success", LogName);
                return new BaseResponse { ResponseCode = 200 };
            }
            catch (Exception ex)
            {
                this.WriteError(ex.Message, LogName);
                return new BaseResponse { ResponseCode = 500 };
            }
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
                this.Write("Success", ("DEV " + text), name);
        }

        public void WriteInfoDev(string text, string name)
        {
            if (_enviroment.IsDevelopment())
                this.Write("Info", ("DEV " + text), name);
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
