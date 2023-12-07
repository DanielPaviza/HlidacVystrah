using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using System.Xml.Linq;
using hlidacVystrah.Model;

namespace hlidacVystrah.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AlertsController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;
        private string url;

        public AlertsController(ILogger<WeatherForecastController> logger)
        {
            this._logger = logger;
            this.url = @"D:\moje\programovani\absolutorium\test_data\clean.xml";
        }

        [HttpGet]
        public AlertsResponse Get()
        {

            try
            {
                // Load the XML file using XDocument
                XDocument xdoc = XDocument.Load(this.url);
                IEnumerable<XElement> alertElements = xdoc.Root.Elements();

                string? dataTimestamp = alertElements.FirstOrDefault(el => el.Name.LocalName == "sent").Value;
                List<XElement> infoElements = alertElements.Where(el => el.Name.LocalName == "info").ToList();

                return new AlertsResponse
                {
                    responseCode = 200,
                    dataTimestamp = dataTimestamp,
                    alerts = infoElements
                };
            }
            catch (Exception ex)
            {
                return new AlertsResponse
                {
                    responseCode = 500,
                    dataTimestamp = ex.Message,
                };
            }

            return new AlertsResponse
            {
                responseCode = 200,
                dataTimestamp = "",
            };
        }

        private XElement FindElementByName(IEnumerable<XElement> elements, string name) {
            return elements.Where(el => el.Name.LocalName == name).FirstOrDefault();
        }
    }
}