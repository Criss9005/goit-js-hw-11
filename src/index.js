import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = '40957682-dd6a267c102109d1db4973f80';
const input = document.querySelector('[name="searchQuery"]');
const btn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery')
const searchDiv = document.querySelector('.search_container')
let search = '';
let searchData = {}
let page = 1
let totalHits
function validateHits(totalHits) { 
  if (totalHits > 0) {
    if (page == 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

  }
  else { 
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }

}

function markUP(searchData) { 
  searchData.forEach(element => {
    gallery.innerHTML += `<div class="photo-card">
                            <a href="${element.largeImageURL}"><img src="${element.webformatURL}" width="320px" height="200px" alt="${element.tags}" loading="lazy"/></a>
                            <div class="info">
                              <p class="info-item">
                              <b>Likes <br>${element.likes}</b>
                              </p>
                              <p class="info-item">
                              <b>Views <br> ${element.views}</b>
                              </p>
                              <p class="info-item">
                              <b>Comments <br> ${element.comments}</b>
                              </p>
                              <p class="info-item">
                              <b>Downloads <br> ${element.downloads}</b>
                              </p>
                            </div>
                         </div>`
  }); 
  let newGallery = new SimpleLightbox('.gallery a'); 
}




async function getData(search) {
  try {
    
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    //console.log(response.data);
    totalHits = response.data.totalHits;
    validateHits(totalHits);
    searchData = response.data.hits.map(item => ({ webformatURL: item.webformatURL, largeImageURL: item.largeImageURL, tags: item.tags, likes: item.likes, views: item.views, comments: item.comments, downloads: item.downloads }))
    //console.log(searchData);
    markUP(searchData);
        
  } catch (error) {
    Notiflix.Notify.failure('Sorry There was an error in conection, please try again');
    console.error(error);
  }
}


btn.addEventListener('click', (e) => { 
  e.preventDefault()
  gallery.innerHTML = ''
  searchDiv.style.position = 'relative'
  search = input.value.replaceAll(' ', '+')
  getData(search)
  page = 1
})


window.addEventListener('scroll', () => { 
  searchDiv.style.position = 'fixed'
  const { scrollHeight, clientHeight, scrollTop } = document.documentElement
  scrollTop + clientHeight > scrollHeight - 1 && setTimeout(newData, 500) 

})

const newData = () => { 
  let totalPages = Math.ceil(totalHits / 40)
  if (page < totalPages) {
    page++;
    getData(search)

  }
  else { 
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
  
}