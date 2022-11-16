'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsBtn=document.getElementById("actors")

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  // console.log(movies.results)
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

//Actor Section--------------------------------------------------------------
const actorrun= async () => {
  const actors= await fetchActors();
  console.log(actors)
  renderActors(actors)
}

actors.addEventListener("click", actorrun)

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  console.log(actorRes)
  renderActor(actorRes);
};

// This function is to fetch actors.
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results[0][3]);
  return data.results;
};
// fetchActors()

// This function is to fetch actor.
const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  return data
};
// fetchActor()

//This function is to fetch single actor related movies(known_for)
const actorMovieCredits = async (person_id) => {
  const url = constructUrl(`person/${person_id}/movie_credits`)
  const res = await fetch(url)
  const data = await res.json()
  const dataRes = data['cast']
  const knownFor = document.getElementById("knownFor")
  for (let i = 0; i < 5; i++) {
    let imagePath = "/no_image.jpg";
    if (dataRes[i].backdrop_path !== null) {
      imagePath = BACKDROP_BASE_URL + dataRes[i].backdrop_path;
      const movieCard = document.createElement("div");
      movieCard.innerHTML = `
        <img src="${imagePath}" alt="${dataRes[i].title
        } poster  ">
        <div class=" text-center">
        <h5>${dataRes[i].title}</h5>
        <span> ratings: ${dataRes[i].vote_average}/10</span>
  </div>`;
      
      knownFor.appendChild(movieCard)

      movieCard.addEventListener("click", () => {
        movieDetails(dataRes[i]);
      });
    }

  }

};


const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div")

  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.innerHTML = `
        <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
      actor.name
    } poster">
        <h3>${actor.name}</h3>`;

    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });
    
    actorsContainer.appendChild(actorDiv);
    CONTAINER.appendChild(actorsContainer)
  });
};

const renderActor = (actor) => {
  CONTAINER.innerHTML = "";
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="actor-backdrop" src=${
               PROFILE_BASE_URL + actor.profile_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="actor-name">${actor.name}</h2>

            <p id="actor-gender"><b>Gender:</b> ${
              actor.gender == 1 ? "famale" : "male"
            }</p>
            <p id="actor-popularity"><b>Popularity:</b> ${actor.popularity}</p>
            <p id="actor-birthday"><b>Birthday:</b> ${actor.birthday}</p>
            <p id="actor-deathday"><b>Deathday:</b> ${actor.deathday}</p>

            <h4 id="actor-bio">${actor.biography}</h4>
        </div>
        <div>
          <h4  id="moviesBy" style="padding:1rem;"> Related Movies:</h4> 
          <div class="row justify-content-center" id="knownFor"></div>
        </div>
    </div>`;

    if (actor.deathday === null) {
      document.getElementById("actor-deathday").remove()
    }
    actorMovieCredits(actor.person_id)
};

//------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", autorun);

const dropDownButton = document.querySelector(".dropbtn")
const dropDownContent = document.querySelector(".dropdown-content")
dropDownButton.addEventListener("click", () => {
  dropDownContent.classList.toggle("show")
})

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    if (dropDownContent.classList.contains('show')) {
      dropDownContent.classList.remove('show');
    }
  }
}

//Shortcut for moving the cursor to the search box
const searchInput = document.getElementById("search-input");

let isKeyPressed = { 
  'a': false, // ASCII code for 'a'
  'q': false, // ASCII code for 'k'
   // ... Other key codes you want to track
};

document.onkeydown = (e) => {
  isKeyPressed[e.key] = true; 
  if (e.ctrlKey && isKeyPressed["q"]) {
    searchInput.focus();
  }
};

document.onkeyup = (e) => {
  isKeyPressed[e.key] = false;
};
