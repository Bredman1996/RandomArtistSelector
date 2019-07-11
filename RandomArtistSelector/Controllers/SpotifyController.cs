using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RandomArtistSelector.Models;

namespace RandomArtistSelector.Controllers
{
    [Route("api/[controller]")]
    public class SpotifyController : Controller
    {

        [HttpPost("[action]")]
        public string GetUserInfo([FromBody] AccessTokenRequest request)
        {
            var web = new WebClient();
            web.Headers.Set("Content-Type", "application/x-www-form-urlencoded");
            string body = $"client_id={request.client_id}&client_secret={request.client_secret}&code={request.code}&grant_type={request.grant_type}&redirect_uri={request.redirect_uri}";
            AuthTokenResponse authInfo = JsonConvert.DeserializeObject<AuthTokenResponse>(web.UploadString(" https://accounts.spotify.com/api/token", body));
            string authToken = authInfo.access_token;
            SpotifyUserInfo userInfo = JsonConvert.DeserializeObject<SpotifyUserInfo>(GetUserId(authToken));
            userInfo.authToken = authToken;
            return JsonConvert.SerializeObject(userInfo);
        }

        public string GetUserId(string authToken)
        {
            var web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            string response = web.DownloadString("https://api.spotify.com/v1/me");
            return response;
        }

        [HttpPost("[action]")]
        public string GetAllUserPlaylists([FromBody] PlaylistRequest request)
        {
            List<Playlist> playlists = new List<Playlist>();
            int offset = 0;
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {request.accessToken}");
            bool looper = true;
            while (looper) {
            JObject response = JObject.Parse(web.DownloadString(request.userUrl+ $"/playlists?offset={offset}&limit=50"));
            JArray items = response["items"].ToObject<JArray>();
                foreach (JObject item in items)
                {
                    Playlist playlist = new Playlist
                    {
                        name = item["name"].ToString(),
                        href = item["href"].ToString(),
                        uri = item["uri"].ToString(),
                    };
                    playlists.Add(playlist);
                }
                int count = items.Count;
                if (count == 50)
                {
                    offset += 50;
                }
                else
                {
                    looper = false;
                }
            }
            string result = JsonConvert.SerializeObject(playlists);
            return result;
        }

        [HttpPost("[action]")]
        public string GetPagedUserPlaylists([FromBody] PagedPlaylistRequest request)
        {
            PlaylistResponse playlistResponse = new PlaylistResponse();
            List<Playlist> playlists = new List<Playlist>();
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {request.accessToken}");
            JObject response = JObject.Parse(web.DownloadString(request.getUrl));
            JArray items = response["items"].ToObject<JArray>();
            foreach (JObject item in items)
            {
                Playlist playlist = new Playlist
                {
                    name = item["name"].ToString(),
                    href = item["href"].ToString(),
                    uri = item["uri"].ToString(),
                };
                playlists.Add(playlist);
            }
            playlistResponse.playlists = playlists;
            playlistResponse.previousUrl = response["previous"].ToString();
            playlistResponse.nextUrl = response["next"].ToString();
            playlistResponse.total = response["total"].ToString();
            playlistResponse.limit = response["limit"].ToString();
            string result = JsonConvert.SerializeObject(playlistResponse);
            return result;
        }

        [HttpPost("[action]")]
        public string GetTracks([FromBody] GetTracksRequest request)
        {
            TracksResponse tracksResponse= new TracksResponse();
            List<Track> tracks = new List<Track>();
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {request.authToken}");
            JObject spotifyResponse = JObject.Parse(web.DownloadString(request.playlistUrl));
            JArray items = spotifyResponse["items"].ToObject<JArray>();
            foreach(JObject item in items)
            {
                Track track = new Track();
                track.TrackName = item["track"]["name"].ToString();
                track.ArtistName = item["track"]["artists"][0]["name"].ToString();
                tracks.Add(track);
            }
            tracksResponse.nextUrl = spotifyResponse["next"].ToString();
            tracksResponse.previousUrl = spotifyResponse["previous"].ToString();
            tracksResponse.Tracks = tracks;
            return JsonConvert.SerializeObject(tracksResponse);
        }

        [HttpGet("[action]")]
        public string GetCurrentlyPlaying([FromQuery] string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            string response = web.DownloadString("https://api.spotify.com/v1/me/player/currently-playing");
            return response;
        }

        [HttpGet("[action]")]
        public void Play([FromQuery] string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            byte[] data = new byte[0];
            web.UploadData("https://api.spotify.com/v1/me/player/play", "PUT", data);
        }

        [HttpGet("[action]")]
        public void PlayPlaylist([FromQuery] string authToken, string uri)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            PlayItemRequest playMe = new PlayItemRequest
            {
                context_uri = uri,
            };
            string body = JsonConvert.SerializeObject(playMe);

            web.UploadString("https://api.spotify.com/v1/me/player/play", "PUT", body);
        }

        [HttpGet("[action]")]
        public void Pause([FromQuery] string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            web.UploadString("https://api.spotify.com/v1/me/player/pause", "PUT", "");
        }

        [HttpGet("[action]")]
        public void SkipSong([FromQuery] string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            string response = web.UploadString("https://api.spotify.com/v1/me/player/next", "");
        }

        [HttpGet("[action]")]
        public void GoBack([FromQuery] string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            string response = web.UploadString("https://api.spotify.com/v1/me/player/previous", "");
        }
    }
}
