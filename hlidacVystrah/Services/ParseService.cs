using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using hlidacVystrah.Model.Response;
using hlidacVystrah.Services.Interfaces;

namespace hlidacVystrah.Services
{

    public class ParseService : MasterService, IParseService
    {

        public ParseService(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public ParseResponse UpdateEvents() {

            //string xmlPath = @"D:\moje\programovani\absolutorium\random\test_data\bourky.xml";
            string xmlPath = "https://www.chmi.cz/files/portal/docs/meteo/om/bulletiny/XOCZ50_OKPR.xml";
            UpdateCount count = new();

            try
            {
                XDocument xdoc = XDocument.Load(xmlPath);
                XElement root = xdoc.Root;

                string dataTimestamp = GetElementValue(root, "sent");

                // if already saved, dont save again
                if(_context.Update.Any(el => el.timestamp == dataTimestamp))
                {
                    return new ParseResponse { ResponseCode = StatusCodes.Status200OK };
                }

                UpdateTable update = new UpdateTable { timestamp = dataTimestamp };
                _context.Update.Add(update);
                _context.SaveChanges();

                List<EventDto> events = root.Descendants().Where(
                    el =>
                        GetElName(el) == "info" &&
                        GetElementValueLower(el, "language") == "cs" &&
                        GetElementValueLower(el, "responseType") != "none"
                ).Select(_event => new EventDto
                {
                    EventType = GetEventId(_event),
                    Severity = GetElementValue(_event, "severity"),
                    Certainty = GetElementValue(_event, "certainty"),
                    Urgency = GetElementValue(_event, "urgency"),
                    Onset = GetElementValue(_event, "onset"),
                    Expires = GetElementValue(_event, "expires"),
                    Description = GetElementValue(_event, "description"),
                    Instruction = GetElementValue(_event, "instruction"),
                    CisorpList = this.GetEventCisorps(_event)
                }).ToList();

                foreach (EventDto _eventDto in events)
                {
                    try
                    {

                        EventTable _event = new EventTable
                        {
                            id_event_type = Int32.Parse(_eventDto.EventType),
                            id_severity = _context.Severity.First(saved => saved.name == _eventDto.Severity).id,
                            id_certainity = _context.Certainity.First(saved => saved.name == _eventDto.Certainty).id,
                            id_urgency = _context.Urgency.First(saved => saved.name == _eventDto.Urgency).id,
                            onset = _eventDto.Onset,
                            expires = _eventDto.Expires,
                            description = _eventDto.Description,
                            instruction = _eventDto.Instruction
                        };

                        if(_context.Event.Local.Any(saved => saved == _event))
                        {
                            count.Event.Failed++;
                            continue;
                        }

                        _context.Event.Add(_event);
                        _context.SaveChanges();
                        count.Event.Success++;

                        foreach (int cisorp in _eventDto.CisorpList)
                        {
                            try
                            {
                                _context.EventLocality.Add(new EventLocalityTable
                                {
                                    id_event = _event.id,
                                    id_locality = cisorp,
                                    id_update = update.id
                                });
                                count.EventLocality.Success++;
                            } catch
                            {
                                count.EventLocality.Failed++;
                            }
                        }

                        _context.SaveChanges();
                    } catch (Exception ex)
                    {
                        return new ParseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
                    }
                }
            }
            catch (Exception ex)
            {
                return new ParseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            return new ParseResponse { ResponseCode = StatusCodes.Status200OK, Count = count };
        }

        public ParseResponse SaveLocalities() {

            string xmlPath = "D:\\moje\\programovani\\absolutorium\\random\\kraje_okresy.xml";
            UpdateCount count = new();

            try {

                XDocument xdoc = XDocument.Load(xmlPath);
                XElement root = xdoc.Root;

                List<XElement> polozky = root.Descendants().First(
                    el => GetElName(el) == "data"
                ).Descendants().Where(
                    el => GetElName(el) == "polozka"
                ).ToList();

                foreach (XElement polozka in polozky)
                {

                    List<XElement> vazby = polozka.Descendants().Where(
                        el => GetElName(el) == "polvaz"
                    ).ToList();

                    XElement locality = vazby[0];
                    XElement region = vazby[1];

                    int id;
                    if (!int.TryParse(GetElementValue(locality, "chodnota"), out id))
                    {
                        count.Locality.Failed++;
                        continue;
                    }

                    int idRegion;
                    if (!int.TryParse(GetElementValue(region, "chodnota"), out idRegion))
                    {
                        count.Locality.Failed++;
                        continue;
                    }

                    // if locality is already tracked (or in db), don't add it again
                    if (
                        _context.Locality.Local.Any(r => r.id == id) ||
                        _context.Locality.Any(r => r.id == id)
                       )
                    {
                        count.Locality.Failed++;
                        continue;
                    }

                    _context.Locality.Add(new LocalityTable
                    {
                        id = id,
                        id_region = idRegion,
                        name = GetElementValue(locality, "text")
                    });
                    count.Locality.Success++;
                }
            } catch (Exception ex) {
                return new ParseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            _context.SaveChanges();

            return new ParseResponse { ResponseCode = StatusCodes.Status200OK, Count = count };
        }

        private ParseResponse SaveRegions() {

            string xmlPath = "D:\\moje\\programovani\\absolutorium\\random\\kraje_okresy.xml";
            UpdateCount count = new();

            try
            {

                // Load the XML file using XDocument
                XDocument xdoc = XDocument.Load(xmlPath);
                XElement root = xdoc.Root;

                List<XElement> polozky = root.Descendants().First(
                    el => GetElName(el) == "data"
                ).Descendants().Where(
                    el => GetElName(el) == "polozka"
                ).ToList();

                foreach (XElement polozka in polozky)
                {

                    XElement region = polozka.Descendants().Where(
                        el => GetElName(el) == "polvaz"
                    ).ToList()[1];

                    int id;
                    if (!int.TryParse(GetElementValue(region, "chodnota"), out id))
                    {
                        count.Region.Failed++;
                        continue;
                    }

                    // if region is already tracked (or in db), don't add it again
                    if (
                        _context.Region.Local.Any(r => r.id == id) ||
                        _context.Region.Any(r => r.id == id)
                       ) 
                    {
                        count.Region.Failed++;
                        continue;
                    }

                    _context.Region.Add(new RegionTable
                    {
                        id = id,
                        name = GetElementValue(region, "text")
                    });
                    count.Region.Success++;
                }
            }
            catch (Exception ex)
            {
                return new ParseResponse { ResponseCode = StatusCodes.Status500InternalServerError };
            }

            _context.SaveChanges();

            return new ParseResponse { ResponseCode = StatusCodes.Status200OK, Count = count };
        }

        private List<int> GetEventCisorps(XElement _event) {

            List<XElement> areas = _event.Descendants().Where(
                el => GetElName(el) == "area"
            ).ToList();

            List<int> cisorps = areas.Descendants().Where(
                area => GetElName(area) == "geocode"
            ).Select(
                geocode => Int32.Parse(GetElementValue(geocode, "value")
            )).ToList();

            return cisorps;
        }

        private string GetElName(XElement el)
        {
            return el.Name.LocalName.ToLower();
        }

        private string? GetElementValueLower(XElement el, string name)
        {
            return GetElementValue(el, name)?.ToLower();
        }
        private string? GetElementValue(XElement el, string name)
        {
            return el.Descendants().FirstOrDefault(el => GetElName(el) == name.ToLower())?.Value;
        }
        private string GetEventId(XElement _event)
        {

            List<XElement> parameters = _event.Descendants().Where(
                    el => GetElName(el) == "parameter"
                ).ToList();

            foreach (var parameter in parameters)
            {
                if (GetElementValueLower(parameter, "valueName") == "awareness_type")
                    return GetElementValueLower(parameter, "value").Split(';')[0];
            }

            return "-1";
        }
    }
}