'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsContainer = document.querySelector(".actorsContainer");


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  // console.log(movies);
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
  const movieCast = await fetchCast(movie.id);
  const relatedMovies = await fetchSimilarMovies(movie.id);
  const movieTrailer = await fetchVideos(movie.id);
  renderMovie(movieRes,movieCast,relatedMovies,movieTrailer);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};


// This function is to fetch genres.
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


// This fetch is to fetch popular movies.
const fetchPopularMovies = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
 
};
// fetchPopularMovies();


// This function is to fetch Top rated movies.
const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
// fetchTopRated();


// This function is to fetch upcoming movies.
const fetchUpComing = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
// fetchUpComing();


// This function is to fetch movie cast.
const fetchCast = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast);
  return data.cast;
};
// fetchCast();


// This function is to fetch trailers.
const fetchVideos = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
// fetchVideos();


// This function is to fetch similar movies.
const fetchSimilarMovies = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};
// fetchSimilarMovies();


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
    movieDiv.setAttribute("class","movieDiv");
    movieDiv.innerHTML = `
        <img class="movieImage" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
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
const renderMovie = (movie,movieCast,relatedMovies,movieTrailer) => {
  CONTAINER.innerHTML = `
    <div class="home-row">
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
      
           <h5>Trailer:</h5>
            <div class="trailerVideo"></div>


            <h5 class="actorsTitle">Actors:</h5>
            <div class ="actors" ></div>
       
            <h5>Similar Movies:</h5>
            <div class="relatedMoviesContainer"></div>

           
            
            </div>
            
    </div>`;
    
    renderCast(movieCast);
    renderRelatedMovies(relatedMovies);
    renderTrailer(movieTrailer);

};

const renderCast = (movieCast) => {
  const actors = document.querySelector(".actors");
  movieCast.slice(0,5).map ((actor)=> {
    const eachActor = document.createElement("div");
    eachActor.setAttribute("class","eachActor");
    eachActor.innerHTML= `<img class="someImages" src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200">
    <p class="actorName">${actor.name}</p>
    `
    eachActor.addEventListener("click", (e)=>{
      actorDetails(actor);
    })

    actors.appendChild(eachActor);
  });
}

const renderRelatedMovies = (relatedMovies) => {
  const related = document.querySelector(".relatedMoviesContainer");
  relatedMovies.slice(0,5).map ((movie)=> {
    const eachMovie = document.createElement("div");
    eachMovie.setAttribute("class","eachMovie");
    eachMovie.innerHTML= `<img class="someImages" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" height="200" width="150">
    <p class="movieName">${movie.title}</p>
    `
    related.addEventListener("click", (e)=>{
      movieDetails(movie);
    })

    related.appendChild(eachMovie);
  });
}


const renderTrailer = (movieTrailer) => {
  const trailerContainer = document.querySelector(".trailerVideo");
  movieTrailer.slice(1,2).map ((video)=> {
    const eachTrailer = document.createElement("div");
    eachTrailer.setAttribute("class","eachTrailer");
    eachTrailer.innerHTML= `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieTrailer.trailer}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
    trailerContainer.appendChild(eachTrailer);
  });
}

//Actor Section--------------------------------------------------------------
const actorrun= async () => {
  const actors= await fetchActors();
  // console.log(actors)
  renderActors(actors)
}

actors.addEventListener("click", actorrun)

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  // const actorMovieCredits = await actorMovieCredits(actor.id);
  // console.log(actorRes)
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
  return data.cast
};


//
//This part is unfinished (and line 223 and 330). I tried what menar does but could not add Movie credits into actors page 
//
// const renderRelatedMovies = (movieCredits) => {
//   const relatedMovies = document.querySelector(".relatedMovies");
//   movieCredits.slice(0,5).map ((movie)=> {
//     const movieContainer = document.createElement("div");
//     movieContainer.setAttribute("class","movieContainer");
//     const eachMovie = document.createElement("div");
//     eachMovie.setAttribute("class","eachMovie");
//     eachMovie.innerHTML= `<img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" height="200">
//     <div class="actorInfo">
//     <p class="actorName">${movie.title}</p>
//     </div>;`
//     // eachActor.addEventListener("click", (e)=>{
//     //   movieDetails();
//     // })
//     movieContainer.appendChild(eachMovie);
//     relatedMovies.appendChild(movieContainer);
//   });
// }


const renderActors = (actors) => {
  actorsContainer.innerHTML = "";
  const actorsContainers = document.createElement("div")
  actorsContainers.setAttribute("class","actorsContainers");
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
    
    actorsContainers.appendChild(actorDiv);
    actorsContainer.appendChild(actorsContainers);
  });
};

const renderActor = (actor) => {
  actorsContainer.innerHTML = "";
  actorsContainer.innerHTML = `
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
          <div class="relatedMovies"></div>
        </div>
    </div>`;

    if (actor.deathday === null) {
      document.getElementById("actor-deathday").remove()
    }
    // renderRelatedMovies(movieCredits)
};

//------------------------------------------------------------------------------------


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
const actorLink = document.querySelector(".actor-link");
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



const button = document.querySelector('.trailer');
button.addEventListener('click', (e) => {
  window.open('https://www.youtube.com/watch?v=umIeYcQLABg', '_blank');
});


const home = document.querySelector('.home')
home.addEventListener('click', () => {
  window.location.reload()
})


