import { fetchById } from './fetch-functions';
const btnWatch = document.querySelector('.watch');
const btnQueue = document.querySelector('.queue');
const gallery = document.querySelector('.gallery');
const modal = document.querySelector('[data-modal]');

const moviesGenre = [
  { number: 28, genre: 'Action' },
  { number: 12, genre: 'Adventure' },
  { number: 16, genre: 'Animation' },
  { number: 35, genre: 'Comedy' },
  { number: 80, genre: 'Crime' },
  { number: 99, genre: 'Documentary' },
  { number: 18, genre: 'Drama' },
  { number: 10751, genre: 'Family' },
  { number: 14, genre: 'Fantasy' },
  { number: 36, genre: 'History' },
  { number: 27, genre: 'Horror' },
  { number: 10402, genre: 'Music' },
  { number: 9648, genre: 'Mystery' },
  { number: 10749, genre: 'Romance' },
  { number: 878, genre: 'Science Fiction' },
  { number: 10770, genre: 'TV Movie' },
  { number: 53, genre: 'Thriller' },
  { number: 10752, genre: 'War' },
  { number: 37, genre: 'Western' },
];

// funcion para encontrar los generos de una pelicula

export function findGender(data) {
  const genreArray = [];
  data.forEach(elementData => {
    moviesGenre.forEach(elementGenre => {
      if (elementData == elementGenre.number) {
        genreArray.push(' ' + elementGenre.genre);
      }
    });
  });
  return genreArray;
}

// Funcion para renderizar las peliculas en gallery

export function renderMovies(movies) {
  let htmlcode = '';
  let imgSrcr = '';
  movies.forEach(movie => {
    let year = movie.release_date.substr(0, 4);
    let genreText = findGender(movie.genre_ids);
    if (movie.poster_path == null)
      imgSrcr = `https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg`;
    else imgSrcr = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    let titleUppercase = movie.title.toUpperCase();
    htmlcode += `<div class="photo-card">
                                  <img class="galleryimage data-modal-open" id="${movie.id}"src="${imgSrcr}" alt="${movie.title}" loading="lazy" />
                                  <div class="info">
                                    <p class="info-item"> 
                                      <b>${titleUppercase}</b>
                                    </p>
                                    <p class="info-item orange-text">
                                      <b>${genreText} | ${year}</b>
                                    </p>
                                 </div>
                               </div>`;
  });
  gallery.innerHTML = htmlcode;
}
export const escKey = e => {
  if (e.key == 'Escape') {
    closeModal();
  }
};

function closeModal() {
  toggleModal();
  document.removeEventListener('keyup', escKey);
}
export function enableModal(param) {
  const refs = {
    openModalBtn: document.querySelectorAll('.data-modal-open'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    backdrop: document.querySelector('.backdrop'),
  };
  if (!param) {
    refs.closeModalBtn.addEventListener('click', e => {
      closeModal();
    });
    refs.backdrop.addEventListener('click', e => {
      if (e.target.classList.contains('backdrop')) {
        closeModal();
      }
    });
  }
}

function toggleModal() {
  modal.classList.toggle('is-hidden');
}

export const fetchMovieById = async id => {
  const spinerCont = document.querySelector('.spiner-container');
  const results = document.querySelector('.results');
  const review = document.querySelector('.abouttext');
  const imgModal = document.querySelector('.img-modal');
  const movieTitle = document.querySelector('.modal-title');
  spinerCont.classList.toggle('hidden');
  imgModal.src = '';
  toggleModal();
  const data = await fetchById(id);
  if (data == undefined) return;
  let isWatched = false;
  let isQueued = false;
  const getMovies = JSON.parse(localStorage.getItem('movies'));
  const getMoviesQue = JSON.parse(localStorage.getItem('movies-que'));
  if (getMovies !== null) {
    getMovies.forEach(movie => {
      if (movie.id == id) {
        isWatched = true;
      }
    });
  }
  if (getMoviesQue !== null) {
    getMoviesQue.forEach(movie => {
      if (movie.id == id) {
        isQueued = true;
      }
    });
  }
  movieTitle.textContent = data.original_title.toUpperCase();
  let movieGen = [];
  data.genres.forEach(element => {
    movieGen.push(' ' + element.name);
  });
  results.innerHTML = `<li><span class="span">${data.vote_average}</span> / ${data.vote_count}</li>
                                    <li>${data.popularity}</li>
                                    <li>${data.original_title}</li>
                                    <li>${movieGen}</li>`;

  review.textContent = data.overview;
  imgModal.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  if (isWatched) {
    btnWatch.textContent = 'Remove';
    btnWatch.classList.add('watched');
  } else {
    btnWatch.textContent = 'add to watched';
    if (btnWatch.classList.contains('watched'))
      btnWatch.classList.remove('watched');
  }
  if (isQueued) {
    btnQueue.textContent = 'Remove';
    btnQueue.classList.add('watched');
  } else {
    btnQueue.textContent = 'add to queue';
    if (btnQueue.classList.contains('watched'))
      btnQueue.classList.remove('watched');
  }
  spinerCont.classList.toggle('hidden');
};

export async function reviewLocalStorage(movieId, type) {
  let getMovies;
  let key = '';
  let text = '';
  let btn;
  if (movieId == 0) return;
  const dataToSave = {};
  const data = await fetchById(movieId);
  if (data == undefined) return;
  dataToSave.release_date = data.release_date;
  dataToSave.genre_ids = data.genres.map(data => data.id);

  dataToSave.id = movieId;
  dataToSave.poster_path = data.poster_path;
  dataToSave.title = data.title;

  if (type == 'watched') {
    getMovies = JSON.parse(localStorage.getItem('movies'));
    key = 'movies';
    btn = btnWatch;
    text = 'watched';
  } else if (type == 'queue') {
    getMovies = JSON.parse(localStorage.getItem('movies-que'));
    key = 'movies-que';
    btn = btnQueue;
    text = 'queue';
  }
  let isInLocalStorage = false;
  if (getMovies == null) {
    localStorage.setItem(key, JSON.stringify([dataToSave]));
    btn.textContent = 'Remove';
    btn.classList.add('watched');
    return;
  }
  getMovies.forEach(movie => {
    if (movie.id == dataToSave.id) {
      isInLocalStorage = true;
      let index = getMovies.findIndex(elem => elem.id == dataToSave.id);
      getMovies.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(getMovies));
      btn.textContent = `add to ${text}`;
      btn.classList.remove('watched');
    }
  });
  if (!isInLocalStorage) {
    getMovies.push(dataToSave);
    localStorage.setItem(key, JSON.stringify(getMovies));
    btn.textContent = 'Remove';
    btn.classList.add('watched');
  }
}
