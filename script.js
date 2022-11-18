'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
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


// Fetch genres
const fetchGenre = async () => {
  const dropDownContent = document.querySelector(".dropdown-content")
  const url = constructUrl("genre/movie/list");
  const res = await fetch(url);
  const data = await res.json();
  
  data.genres.forEach(element => {
    const genreLink = document.createElement("a");
    genreLink.textContent = element.name
    genreLink.classList.add("genre")
    dropDownContent.appendChild(genreLink);

    //Fetching the required genre of movies when its name clicked 
    genreLink.addEventListener("click", () => {
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}&with_genres=${element.id}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    })
  });
};
fetchGenre();

// This function is to fetch actors.
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
//fetchActors();

// This fetch is to fetch popular movies.
const fetchPopularMovies = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.results);
  return data.results;
};
//fetchPopularMovies();

// This function is to fetch Top rated movies.
const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.results);
  return data.results;
};
//fetchTopRated();


// This function is to fetch upcoming movies.
const fetchUpComing = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  const data = await res.json();
  //console.log(data.results);
  return data.results;
};
//fetchUpComing();


// This function is to fetch movie cast.
const fetchCast = async () => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast);
  return data.cast;
};
//fetchCast();


// This function is to fetch actor.
const fetchActor = async () => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data);
  return data;
};
//fetchActor();


// This function is to fetch trailers.
const fetchVideos = async () => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
//fetchVideos();


// This function is to fetch similar movies.
const fetchSimilarMovies = async () => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
//fetchSimilarMovies();

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};



// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
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
            <h3>vote_average:</h3>
            <p id="movie-vote_average">${movie.vote_average}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);




// Filter dropdown
const dropDownButtons = document.querySelectorAll(".dropbtn")
const dropDownContent = document.querySelector(".dropdown-content")
const filterDropDown = document.querySelector(".filter-dropdown-content")

filterDropDown.childNodes.forEach(link => {
  link.addEventListener("click", () => {
    if (link.textContent === "Up coming") {
      fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Popular") {
      fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Now playing") {
      fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    } else if (link.textContent === "Top rated") {
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${atob(
        "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
      )}`)
      .then(resp => resp.json())
      .then(data => renderMovies(data.results))
    }
  })
})

// Dropdown clicks
dropDownButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    if (e.target.textContent === "Genre ") {
      dropDownContent.classList.toggle("show")
    } else if (e.target.textContent === "Filter ") {
      filterDropDown.classList.toggle("show")
    }
  })
})

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    if (dropDownContent.classList.contains('show')) {
      dropDownContent.classList.remove('show');
    } else if (filterDropDown.classList.contains('show')) {
      filterDropDown.classList.remove('show');
    }
  }
}

// Actors fetch and listening
const actorLink = document.getElementById("actor-link")
actorLink.addEventListener("click", () => {
  fetch(`${TMDB_BASE_URL}/person/popular?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`)
  .then(resp => resp.json())
  .then(data => renderMovies(data.results))
})

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

// Handling search inputs
searchInput.addEventListener("input", (e) => {
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${e.target.value}&page=1&include_adult=false`)
  .then(resp => resp.json())
  .then(data => { 
    data.results.forEach(result => {
      if (result.media_type === "movie") {
        renderMovies(data.results)
      } /* else if () {

      } */

    })  
  }
)
})


