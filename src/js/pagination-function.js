const refs = {
  listado: document.querySelector('.pagnumber'),
  botonAtras: document.getElementById('atras'),
  botonSiguiente: document.getElementById('siguiente'),
  pageOne: document.getElementById('primera'),
  pageFinal: document.getElementById('ultima'),
};

let totalPag2 = 0;
let currentPage = 1;

export function paginationLT(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / 20);
  totalPag2 = totalPages;
  const pagination = [];
  if (totalPages <= 9) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(i);
    }
  } else {
    pagination.push(1);
    if (currentPage > 2) pagination.push('...');

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(currentPage + 1, totalPages - 1);

    if (currentPage === totalPages - 2) {
      start = currentPage - 2;
      end = currentPage;
    }

    for (let i = start; i <= end; i++) {
      pagination.push(i);
    }

    if (currentPage < totalPages - 2) pagination.push('...');
    pagination.push(totalPages);
  }
  return pagination;
}
