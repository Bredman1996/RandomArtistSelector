using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RandomArtistSelector.Models
{
    public class TracksResponse
    {
        public List<Track> Tracks {get; set;}
        public string nextUrl { get; set; }
        public string previousUrl { get; set; }
    }
}
