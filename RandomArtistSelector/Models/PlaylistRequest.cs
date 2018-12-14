using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RandomArtistSelector.Models
{
    public class PlaylistRequest
    {
        public string accessToken { get; set; }
        public string userUrl { get; set; }
    }
}
