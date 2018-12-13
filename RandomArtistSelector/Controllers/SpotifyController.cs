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
            string userInfo = this.GetUserId(authToken);
            return userInfo;
        }
        public string GetUserId(string authToken)
        {
            var web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            var response = web.DownloadString("https://api.spotify.com/v1/me");
            return response;
        }

        [HttpPost("[action]")]
        public string[] GetUsersPlaylists([FromBody] string url, string authToken)
        {
            WebClient web = new WebClient();
            web.Headers.Set("Authorization", $"Bearer {authToken}");
            JObject playlists = (JObject)web.DownloadString(url+ "/playlists?offset=0&limit=50");
            return null;
        }
    }
}
