

using System.Collections.Generic;

namespace RandomArtistSelector.Models
{
    public class PlaylistResponse
    {
        public string nextUrl { get; set; }
        public string previousUrl { get; set; }
        public List<Playlist> playlists { get; set; }
        public string total { get; set; }
        public string limit { get; set; }
    }
}
