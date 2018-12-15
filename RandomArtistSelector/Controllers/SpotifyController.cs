using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RandomArtistSelector.Infrastructure;
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
        public string GetUsersPlaylists([FromBody] PlaylistRequest request)
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
                        spotifyUrl = item["external_urls"]["spotify"].ToString(),
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
    }
}
