using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RandomArtistSelector.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RandomArtistSelector.Infrastructure
{
    public interface IArtistManager
    {
        List<Genre> GetAllGenres();
    }
    public class ArtistManager : IArtistManager
    {
        public ArtistManager()
        {

        }
        public List<Genre> GetAllGenres()
        {
            JObject genresFromFile;
            using (StreamReader file = File.OpenText("Genres.Json"))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                genresFromFile = (JObject)JToken.ReadFrom(reader);
            }
            List<Genre> genres = new List<Genre> { };
            JArray genresInArray = (JArray)genresFromFile["genres"];
            for(int i = 0; i < genresInArray.Count; i++)
            {
                JObject current = (JObject)genresInArray[i];
                Genre genre = JsonConvert.DeserializeObject<Genre>(current.ToString());
                genres.Add(genre);
            }
            return genres;
        }
    }
}
