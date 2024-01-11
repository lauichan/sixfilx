import { genreList } from "./fetch.js";

export function createCard(response) {
  const movies = response.results;

  let html = "";
  movies.forEach((movie) => (html += renderCardHTML(movie)));
  document.getElementById("movies").insertAdjacentHTML("beforeend", html);
  movies.forEach((movie) => createGenreList(movie.id, movie.genre_ids));
}

function renderCardHTML(movie) {
  let src = "";
  if (movie.poster_path) {
    src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } else {
    src = "images/noimage.jpg";
  }

  return `
  <div id="${movie.id}">
    <img class="poster" src="${src}" alt="${movie.title}"/>
    <h2 class="title">${movie.title}</h2>
    <ul class="genre"></ul>
    <p class="vote">${(movie.vote_average * 10).toFixed(1)}%</p>
  </div>`;
}

function createGenreList(movieId, genreIds) {
  const genreName = genreList.filter((genre) => genreIds.includes(genre.id));
  const genreListElement = document.getElementById(`${movieId}`).querySelector(".genre");

  genreName.forEach((genre) => {
    const li = `<li class=${genre.class}>${genre.name}</li>`;
    genreListElement.insertAdjacentHTML("beforeend", li);
  });
}

export function handleClickCard(event) {
  const cardList = document.getElementById("movies");
  if (event.target === cardList) return;
  let target = event.target.matches("div") ? event.target : event.target.parentNode;
  location.href = `detail.html?id=${target.id}`;
}

export async function loadPost({ id, backdrop_path, title, release_date, genres, overview }) {
  let dataLoad = `
  <main class="detail_main">
    <div class="detail_bg">
      <img src="https://image.tmdb.org/t/p/original${backdrop_path}" alt="영화이미지" class="detail_bg_img"/>
    </div>
  </main>
  <section class="detail_section">
    <h1 class="detail_movie_title">${title}</h1>
    <div class="detail_movie_wrap_two" id="${id}">
      <ul class="genre"></ul>
      <p class="detail_movie_wrap_year">${release_date}</p>
    </div>
    <div class="detail_movie_over_view">
      <p class="detail_movie_over_view_text">${overview}</p>
    </div>
    <button class="detail_movie_appreciate">감상하기</button>
  </section>`;

  document.getElementById("moviePost").insertAdjacentHTML("beforeend", dataLoad);
  let genreIds = genres.map((a) => a.id);
  createGenreList(id, genreIds);
}
