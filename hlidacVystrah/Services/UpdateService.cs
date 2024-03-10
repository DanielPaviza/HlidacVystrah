
using hlidacVystrah.Model;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;
using hlidacVystrah.Model.Dto;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace hlidacVystrah.Services
{

    public class UpdateService : MasterService, IUpdateService
    {

        private IParseService _parseService;
        private readonly ILogService _logService;

        public UpdateService(AppDbContext context, IParseService parseService, ILogService logService) : base(context)
        {
            _context = context;
            _parseService = parseService;
            _logService = logService;
            _logService.Service = "UpdateService";
        }

        public ParseResponse UpdateEvents(string token) {

            string LOG_NAME = "UpdateEvents";

            string decodedToken = token.Replace(' ', '+');
            AdminTable admin = _context.Admin.FirstOrDefault(a => a.update_events_token == decodedToken && decodedToken != null);
            if(admin == null)
            {
                _logService.WriteError("Unauthorized. Invalid update token.", LOG_NAME);
                return  new ParseResponse { ResponseCode = StatusCodes.Status401Unauthorized };
            }

            return _parseService.UpdateEvents();
        }

        public UpdateListResponse GetList(UpdateListDto? data)
        {
            string LOG_NAME = "GetList";

            try
            {

                UpdateDto? currentUpdate;

                if (data.Timestamp == null)
                {
                    currentUpdate = _context.Update.OrderByDescending(u => u.id)
                    .Select(u => new UpdateDto
                    {
                        Timestamp = u.timestamp,
                        TimestampReadable = TimestampToReadable(u.timestamp)
                    }).FirstOrDefault();
                } else
                {
                    currentUpdate = _context.Update.Where(u => u.timestamp.Contains(data.Timestamp))
                    .Select(u => new UpdateDto
                    {
                        Timestamp = u.timestamp,
                        TimestampReadable = TimestampToReadable(u.timestamp)
                    }).FirstOrDefault();
                }

                if (currentUpdate == null)
                    return new UpdateListResponse { ResponseCode = StatusCodes.Status400BadRequest };

                UpdateTable currentUpdateTable = _context.Update.Where(u => u.timestamp == currentUpdate.Timestamp).First();
                int currentUpdateIndex = _context.Update.OrderByDescending(u => u.id).ToList().IndexOf(currentUpdateTable);
                int rowsToTakeFromEachSide = 3;

                int numOfSkippedRows = currentUpdateIndex - rowsToTakeFromEachSide;
                int numOfNextRowsToTake = rowsToTakeFromEachSide;
                if (numOfSkippedRows < 0)
                {
                    numOfNextRowsToTake = rowsToTakeFromEachSide + numOfSkippedRows;
                    numOfSkippedRows = 0;
                }

                List<UpdateDto> nextUpdates = _context.Update.OrderByDescending(u => u.id)
                .Skip(numOfSkippedRows).Take(numOfNextRowsToTake)
                .Select(u => new UpdateDto
                {
                    Timestamp = u.timestamp,
                    TimestampReadable = TimestampToReadable(u.timestamp)
                }).ToList();

                int numOfPreviousUpdatesToTake = (rowsToTakeFromEachSide * 2) - nextUpdates.Count;
                
                List<UpdateDto> previousUpdates = _context.Update.OrderByDescending(u => u.id)
                    .Skip(currentUpdateIndex + 1).Take(numOfPreviousUpdatesToTake)
                    .Select(u => new UpdateDto
                    {
                        Timestamp = u.timestamp,
                        TimestampReadable = TimestampToReadable(u.timestamp)
                    }).ToList();

                _logService.WriteSuccessDev("ok", LOG_NAME);

                return new UpdateListResponse { 
                    ResponseCode = StatusCodes.Status200OK,
                    PreviousUpdates = previousUpdates,
                    CurrentUpdate = currentUpdate,
                    NextUpdates = nextUpdates
                };

            } catch (Exception ex)
            {
                _logService.WriteError(ex.Message, LOG_NAME);
                return new UpdateListResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }
        }

        public static string TimestampToReadable(string? timestamp)
        {

            if (timestamp == null)
                return null;

            DateTimeOffset localTime = DateTimeOffset.Parse(timestamp);
            string readable = localTime.ToString();

            string date = readable.Split(' ')[0];
            string hours = readable.Split(" ")[1];
            hours = hours.Split(":")[0] + ':' + hours.Split(":")[1];

            //today
            if (localTime.Date == DateTimeOffset.Now.Date)
                return $"Dnes v {hours}";

            //yesterday
            if (localTime.Date == DateTimeOffset.Now.Date.AddDays(-1))
                return $"Včera v {hours}";

            return $"{date} {hours}"; ;
        }
    }
}