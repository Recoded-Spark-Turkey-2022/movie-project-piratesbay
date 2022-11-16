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
  const movieTrailer = await fetchVideos(movie.id);
  const relatedMovies = await fetchSimilarMovies(movie.id);
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
  //console.log(data.genres);
  data.genres.forEach(element => {
    const genreLink = document.createElement("a");
    genreLink.textContent = element.name
    genreLink.classList.add("genre")
    dropDownContent.appendChild(genreLink);
  });
};
// fetchGenre();


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
            <h3 class="actorsTitle">Actors:</h3>
            <div class ="actors" >
            </div>
            
        
        
            <h3>Trailer:</h3>
            <div class="trailerContainer"></div>
       
       
            <h3>Similar Movies:</h3>
            <div class="relatedMoviesContainer"></div>
       
    </div>`;
    renderCast(movieCast);
    renderTrailer(movieTrailer);
    renderRelatedMovies(relatedMovies);

};

const renderCast = (movieCast) => {
  const actors = document.querySelector(".actors");
  movieCast.slice(0,5).map ((actor)=> {
    const castContainer = document.createElement("div");
    castContainer.setAttribute("class","castContainer");
    const eachActor = document.createElement("div");
    eachActor.setAttribute("class","eachActor");
    eachActor.innerHTML= `<img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster" height="200">
    <p class="actorName">${actor.name}</p>
    `
    eachActor.addEventListener("click", (e)=>{
      actorDetails(actor);
    })

    castContainer.appendChild(eachActor);
    actors.appendChild(castContainer);
  });
}

const renderRelatedMovies = (relatedMovies) => {
  const related = document.querySelector(".relatedMoviesContainer");
  relatedMovies.slice(0,5).map ((movie)=> {
    const relatedContainer = document.createElement("div");
    relatedContainer.setAttribute("class","relatedContainer");
    const eachMovie = document.createElement("div");
    eachMovie.setAttribute("class","eachMovie");
    eachMovie.innerHTML= `<img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" height="200" width="150">
    <p class="movieName">${movie.title}</p>
    `
    relatedContainer.addEventListener("click", (e)=>{
      movieDetails(movie);
    })

    relatedContainer.appendChild(eachMovie);
    related.appendChild(relatedContainer);
  });
}


const renderTrailer = (movieTrailer) => {
  const trailer = document.querySelector(".trailerContainer");
  movieTrailer.slice(1,2).map ((video)=> {
    const trailerContainer = document.createElement("div");
    trailerContainer.setAttribute("class","trailerContainer");
    const eachTrailer = document.createElement("div");
    eachTrailer.setAttribute("class","eachTrailer");
    eachTrailer.innerHTML= `<iframe width="560" height="315" src="https://www.youtube.com/embed/${movieTrailer.trailer}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `

    trailerContainer.appendChild(eachTrailer);
    trailer.appendChild(trailerContainer);
  });
}

//Actor Section--------------------------------------------------------------
const actorrun= async () => {
  const actors= await fetchActors();
  console.log(actors)
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


const button = document.querySelector('.trailer');
button.addEventListener('click', (e) => {
  window.open('https://www.youtube.com/watch?v=umIeYcQLABg', '_blank');
});


const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".container");
// console.log(movieLists);

arrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll(".movieDiv").length;
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });

  // console.log(Math.floor(window.innerWidth / 270));
});
