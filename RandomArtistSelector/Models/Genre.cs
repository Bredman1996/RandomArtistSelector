using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RandomArtistSelector.Models
{
    public class Genre
    {
        public string Name { get; set; }
        public SubGenre[] SubGenres { get; set; }
    }
}
