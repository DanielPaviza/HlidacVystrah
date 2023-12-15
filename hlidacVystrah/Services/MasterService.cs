using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using hlidacVystrah.Model;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.IO;
using System;

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