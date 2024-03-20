import { getTrending, fetchBySearch, fetchById } from './fetch-functions';
import { renderMovies, enableModal } from './functions';
import { selectedBySearch, string } from './index';
import { paginationLT } from './pagination-function';

const refs = {
  listado: document.querySelector('.pagnumber'),
  botonAtras: document.getElementById('atras'),
  botonSiguiente: document.getElementById('siguiente'),
  pageOne: document.getElementById('primera'),
  pageFinal: document.getElementById('ultima'),
};

const gallery = document.querySelector('.gallery');
// const loader = document.querySelector('.dot-spinner');
const submit = document.querySelector('.btn');

let currentPage = 1;
let currentPage2 = 1;
let totalPag2 = 15;
let totalItems;

export async function firstPagination() {
  const data = await getTrending(2);
  totalPag2 = data.total_pages;
  totalItems = data.total_results;
  const paginationResult = paginationLT(totalItems, 1);
  renderPagination(paginationResult);
}

firstPagination();

function renderAll() {
  if (selectedBySearch == 0) {
    const getTrendingMovies = async () => {
      const data = await getTrending(currentPage);
      if (data == undefined) return;
      const { results: movies, total_pages } = data;
      renderMovies(movies);
      enableModal(true);
    };
    getTrendingMovies();
  } else {
    async function renderPage() {
      string.trim();
      const data = await fetchBySearch(string, currentPage);
      const { results: movies, total_pages } = data;
      renderMovies(movies);
      enableModal(false);
    }
    renderPage();
  }
}

// Función para renderizar los números de página en la interfaz
export function renderPagination(paginationArray, search) {
  refs.listado.innerHTML = ''; // Limpiar contenido anterior
  paginationArray.forEach(item => {
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
        renderAll();
        const paginationResult = paginationLT(totalItems, currentPage);
        if (search == true) {
          enableModal(false);
          renderPagination(paginationResult, true);
        } else {
          renderPagination(paginationResult);
        }
      });
    }
    refs.listado.appendChild(link);
  });
}

renderPagination(paginationLT(totalItems, currentPage2));

// Asignar eventos a los botones de "Atrás" y "Siguiente"
refs.botonAtras.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    const paginationResult = paginationLT(totalItems, currentPage);
    renderPagination(paginationResult);
    renderAll();
  }
});

refs.botonSiguiente.addEventListener('click', async () => {
  if (currentPage < totalPag2) {
    currentPage++;
    const paginationResult = paginationLT(totalItems, currentPage);
    renderPagination(paginationResult);
    renderAll();
  }
});

/* crear la funcion con total_results */

submit.addEventListener('click', async e => {
  e.preventDefault();
  const data = await fetchBySearch(string, 1);
  totalPag2 = data.total_pages;
  totalItems = data.total_results;
  currentPage = 1;
  const paginationResult = paginationLT(totalItems, 1);
  renderPagination(paginationResult, true);
});
