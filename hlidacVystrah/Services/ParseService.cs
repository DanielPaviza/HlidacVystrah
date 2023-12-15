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

            List<AlertDto> alerts = new();
            string xmlPath = @"D:\moje\programovani\absolutorium\random\test_data\bourky.xml";
            UpdateCount count = new();

            try
            {
                // Load the XML file using XDocument
                XDocument xdoc = XDocument.Load(xmlPath);
                XElement root = xdoc.Root;

                string dataTimestamp = GetElementValue(root, "sent");

                alerts = root.Descendants().Where(
                    el =>
                        el.Name.LocalName.ToLower() == "info" &&
                        GetElementValueLower(el, "language") == "cs" &&
                        GetElementValueLower(el, "responseType") != "none"
                ).Select(alert => new AlertDto
                {
                    language = GetElementValue(alert, "language"),
                    eventType = GetElementValue(alert, "event"),
                    severity = GetElementValue(alert, "severity"),
                    certainty = GetElementValue(alert, "certainty"),
                    onset = GetElementValue(alert, "onset"),
                    expires = GetElementValue(alert, "expires"),
                    description = GetElementValue(alert, "description"),
                    instruction = GetElementValue(alert, "instruction"),
                    cisorps = this.GetAlertCisorps(alert)
                }).ToList();

                foreach (AlertDto alert in alerts)
                {
                    try
                    {
                        EventTable _event = new EventTable
                        {
                            id_event_type = _context.EventType.First(saved => saved.name == alert.eventType).id,
                            id_severity = _context.Severity.First(saved => saved.name == alert.severity).id,
                            id_certainity = _context.Certainity.First(saved => saved.name == alert.certainty).id,
                            onset = alert.onset,
                            expires = alert.expires,
                            description = alert.description,
                            instruction = alert.instruction
                        };

                        if(
                            _context.Event.Any(saved => saved == _event) ||
                            _context.Event.Local.Any(saved => saved == _event)
                          )
                        {
                            count.Event.failed++;
                            continue;
                        }

                        _context.SaveChanges();
                        count.Event.success++;

                        foreach (int cisorp in alert.cisorps)
                        {

                            try
                            {
                                _context.EventLocality.Add(new EventLocalityTable
                                {
                                    id_event = _event.id,
                                    id_locality = cisorp,
                                });

                                _context.SaveChanges();
                                count.EventLocality.success++;
                            } catch
                            {
                                count.EventLocality.failed++;
                            }
                        } 
                    } catch (Exception ex)
                    {
                        return new ParseResponse { responseCode = StatusCodes.Status500InternalServerError };
                    }

                }
            }
            catch (Exception ex)
            {
                return new ParseResponse { responseCode = StatusCodes.Status500InternalServerError };
            }

            return new ParseResponse { responseCode = StatusCodes.Status200OK, count = count };
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
                        count.Locality.failed++;
                        continue;
                    }

                    int idRegion;
                    if (!int.TryParse(GetElementValue(region, "chodnota"), out idRegion))
                    {
                        count.Locality.failed++;
                        continue;
                    }

                    // if locality is already tracked (or in db), don't add it again
                    if (
                        _context.Locality.Local.Any(r => r.id == id) ||
                        _context.Locality.Any(r => r.id == id)
                       )
                    {
                        count.Locality.failed++;
                        continue;
                    }

                    _context.Locality.Add(new LocalityTable
                    {
                        id = id,
                        id_region = idRegion,
                        name = GetElementValue(locality, "text")
                    });
                    count.Locality.success++;
                }
            } catch (Exception ex) {
                return new ParseResponse { responseCode = StatusCodes.Status500InternalServerError };
            }

            _context.SaveChanges();

            return new ParseResponse { responseCode = StatusCodes.Status200OK, count = count };
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
                        count.Region.failed++;
                        continue;
                    }

                    // if region is already tracked (or in db), don't add it again
                    if (
                        _context.Region.Local.Any(r => r.id == id) ||
                        _context.Region.Any(r => r.id == id)
                       ) 
                    {
                        count.Region.failed++;
                        continue;
                    }

                    _context.Region.Add(new RegionTable
                    {
                        id = id,
                        name = GetElementValue(region, "text")
                    });
                    count.Region.success++;
                }
            }
            catch (Exception ex)
            {
                return new ParseResponse { responseCode = StatusCodes.Status500InternalServerError };
            }

            _context.SaveChanges();

            return new ParseResponse { responseCode = StatusCodes.Status200OK, count = count };
        }

        private List<int> GetAlertCisorps(XElement alert) {

            List<XElement> areas = alert.Descendants().Where(
                    el => el.Name.LocalName.ToLower() == "area"
                ).ToList();

            List<int> cisorps = areas.Descendants().Where(
                    area => area.Name.LocalName.ToLower() == "geocode"
                    ).Select(geocode => Int32.Parse(GetElementValue(geocode, "value"))).ToList();

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