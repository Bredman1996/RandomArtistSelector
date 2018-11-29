using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RandomArtistSelector.Infrastructure;
using RandomArtistSelector.Models;

namespace RandomArtistSelector.Controllers
{
    [Route("api/[controller]")]
    public class ArtistController : Controller
    {
        private readonly IArtistManager _artistManager = new ArtistManager();

        [HttpGet("[action]")]
        public List<Genre> Genres()
        {
            return _artistManager.GetAllGenres();
        }


    }
}
