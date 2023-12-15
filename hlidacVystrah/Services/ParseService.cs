using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace hlidacVystrah.Services
{

    public class ParseService : MasterService
    {

        public ParseService(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public ParseResponse UpdateAlerts() {

            List<EventDto> events = new();
            string xmlPath = @"D:\moje\programovani\absolutorium\random\test_data\bourky.xml";
            UpdateCount count = new();

            try
            {
                // Load the XML file using XDocument
                XDocument xdoc = XDocument.Load(xmlPath);
                XElement root = xdoc.Root;

                string dataTimestamp = GetElementValue(root, "sent");

                events = root.Descendants().Where(
                    el =>
                        el.Name.LocalName.ToLower() == "info" &&
                        GetElementValueLower(el, "language") == "cs" &&
                        GetElementValueLower(el, "responseType") != "none"
                ).Select(_event => new EventDto
                {
                    language = GetElementValue(_event, "language"),
                    eventType = GetElementValue(_event, "event"),
                    severity = GetElementValue(_event, "severity"),
                    certainty = GetElementValue(_event, "certainty"),
                    onset = GetElementValue(_event, "onset"),
                    expires = GetElementValue(_event, "expires"),
                    description = GetElementValue(_event, "description"),
                    instruction = GetElementValue(_event, "instruction"),
                    cisorps = this.GetEventCisorps(_event)
                }).ToList();

                foreach (EventDto _eventDto in events)
                {
                    try
                    {
                        EventTable _event = new EventTable
                        {
                            id_event_type = _context.EventType.First(saved => saved.name == _eventDto.eventType).id,
                            id_severity = _context.Severity.First(saved => saved.name == _eventDto.severity).id,
                            id_certainity = _context.Certainity.First(saved => saved.name == _eventDto.certainty).id,
                            onset = _eventDto.onset,
                            expires = _eventDto.expires,
                            description = _eventDto.description,
                            instruction = _eventDto.instruction
                        };

                        if(
                            _context.Event.Any(saved => saved == _event) ||
                            _context.Event.Local.Any(saved => saved == _event)
                          )
                        {
                            count.Event.Failed++;
                            continue;
                        }

                        _context.SaveChanges();
                        count.Event.Success++;

                        foreach (int cisorp in _eventDto.cisorps)
                        {

                            try
                            {
                                _context.EventLocality.Add(new EventLocalityTable
                                {
                                    id_event = _event.id,
                                    id_locality = cisorp,
                                });

                                _context.SaveChanges();
                                count.EventLocality.Success++;
                            } catch
                            {
                                count.EventLocality.Failed++;
                            }
                        } 
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
                    el => el.Name.LocalName.ToLower() == "data"
                ).Descendants().Where(
                    el => el.Name.LocalName.ToLower() == "polozka"
                ).ToList();

                foreach (XElement polozka in polozky)
                {

                    List<XElement> vazby = polozka.Descendants().Where(
                        el => el.Name.LocalName.ToLower() == "polvaz"
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
                    el => el.Name.LocalName.ToLower() == "data"
                ).Descendants().Where(
                    el => el.Name.LocalName.ToLower() == "polozka"
                ).ToList();

                foreach (XElement polozka in polozky)
                {

                    XElement region = polozka.Descendants().Where(
                        el => el.Name.LocalName.ToLower() == "polvaz"
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
                el => el.Name.LocalName.ToLower() == "area"
            ).ToList();

            List<int> cisorps = areas.Descendants().Where(
                area => area.Name.LocalName.ToLower() == "geocode"
            ).Select(
                geocode => Int32.Parse(GetElementValue(geocode, "value")
            )).ToList();

            return cisorps;
        }

        private string? GetElementValueLower(XElement el, string name)
        {
            return GetElementValue(el, name)?.ToLower();
        }
        private string? GetElementValue(XElement el, string name)
        {
            return el.Descendants().FirstOrDefault(el => el.Name.LocalName.ToLower() == name.ToLower())?.Value;
        }
    }
}