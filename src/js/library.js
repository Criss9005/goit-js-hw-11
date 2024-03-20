import {
  renderMovies,
  fetchMovieById,
  enableModal,
  escKey,
  reviewLocalStorage,
} from './functions';
import { paginationLT } from './pagination-function';

const btnW = document.querySelector('.btn-watched');
const btnQ = document.querySelector('.btn-queue');
const gallery = document.querySelector('.gallery');
const btnWatchModal = document.querySelector('.watch');
const btnQueueModal = document.querySelector('.queue');

let movieId = 0;
const refs = {
  listado: document.querySelector('.pagnumber'),
  botonAtras: document.getElementById('atras'),
  botonSiguiente: document.getElementById('siguiente'),
  pageOne: document.getElementById('primera'),
  pageFinal: document.getElementById('ultima'),
};

let currentPage = 1;
let extremeButtonsType = 'movies';

const renderMoviesLibrary = (firstTime, movies, page) => {
  gallery.innerHTML = '';
  if (movies.length > 0) {
    const toRender = [];
    movies.forEach(movie => {
      if (movie.page == page) {
        toRender.push(movie);
      }
    });
    console.log(toRender);
    renderMovies(toRender);
    if (firstTime) {
      enableModal(false);
      gallery.addEventListener('click', e => {
        if (e.target.nodeName == 'IMG') {
          movieId = e.target.id;
          fetchMovieById(movieId);
          document.addEventListener('keyup', escKey);
        }
      });
    } else {
      enableModal(true);
    }
  }
};

const renderWatchedLocal = param => {
  const moviesWithPage = addPage('movies');
  moviescount = moviesWithPage.length;
  renderLibraryPagination(paginationLT(moviescount, currentPage), 'movies');
  renderMoviesLibrary(param, moviesWithPage, currentPage);
};

const renderQueLocal = param => {
  const moviesWithPage = addPage('movies-que');
  moviescount = moviesWithPage.length;
  renderLibraryPagination(paginationLT(moviescount, currentPage), 'movies-que');
  renderMoviesLibrary(param, moviesWithPage, currentPage);
};

btnQ.addEventListener('click', e => {
  gallery.innerHTML = '';
  currentPage = 1;
  btnQ.classList.add('active');
  btnW.classList.remove('active');
  extremeButtonsType = 'movies-que';
  renderQueLocal(false);
});

btnW.addEventListener('click', () => {
  gallery.innerHTML = '';
  currentPage = 1;
  btnW.classList.add('active');
  btnQ.classList.remove('active');
  extremeButtonsType = 'movies';
  renderWatchedLocal(false);
});
btnWatchModal.addEventListener('click', async () => {
  await reviewLocalStorage(movieId, 'watched');
  if (btnW.classList.contains('active')) {
    renderWatchedLocal(false);
  }
});
btnQueueModal.addEventListener('click', async () => {
  await reviewLocalStorage(movieId, 'queue');
  console.log(btnQueueModal);
  if (btnQ.classList.contains('active')) {
    renderQueLocal(false);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  btnW.classList.add('active');
  renderWatchedLocal(true);
});

function renderLibraryPagination(pArray, type) {
  refs.listado.innerHTML = ''; // Limpiar contenido anterior
  pArray.forEach(item => {
    const link = document.createElement('button');

    if (item == currentPage) {
      link.classList.add('main-color');
    }

    if (item === '...') {
      link.textContent = '...';
    } else {
      link.textContent = item;

      link.addEventListener('click', () => {
        currentPage = item;
        const moviesWithPage = addPage(type);
        renderMoviesLibrary(false, moviesWithPage, currentPage);
        renderLibraryPagination(paginationLT(moviescount, currentPage), type);
      });
    }
    refs.listado.appendChild(link);
  });
}

let countMovies = 0;
let countPages = 1;

function addPage(key) {
  const movies = JSON.parse(localStorage.getItem(key));
  console.log('key' + key);
  movies.forEach(element => {
    if (countMovies == 20) {
      countPages++;
      countMovies = 0;
    }
    countMovies++;
    element.page = countPages;
  });
  console.log(movies);
  totalPag2 = countPages;
  countMovies = 0;
  countPages = 1;
  return movies;
}

let moviescount = 0;

refs.botonAtras.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    const moviesWithPage = addPage(extremeButtonsType);
    renderMoviesLibrary(false, moviesWithPage, currentPage);
    renderLibraryPagination(
      paginationLT(moviescount, currentPage),
      extremeButtonsType
    );
  }
});
let totalPag2;

refs.botonSiguiente.addEventListener('click', async () => {
  if (currentPage < totalPag2) {
    currentPage++;
    const moviesWithPage = addPage(extremeButtonsType);
    renderMoviesLibrary(false, moviesWithPage, currentPage);
    renderLibraryPagination(
      paginationLT(moviescount, currentPage),
      extremeButtonsType
    );
  }
});
