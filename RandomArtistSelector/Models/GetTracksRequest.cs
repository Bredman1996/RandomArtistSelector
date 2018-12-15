using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RandomArtistSelector.Models
{
    public class GetTracksRequest
    {
        public string playlistUrl { get; set; }
        public string playlistName { get; set; }
        public string authToken { get; set; }
    }
}
