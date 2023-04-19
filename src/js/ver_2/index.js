import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

Notiflix.Notify.init({
    width: '280px',
    position: 'top-center',
    distance: '2px',
    opacity: 1,
});


lmBtnEl = document.querySelector('.load-more');
galleryEl = document.querySelector('.gallery');
srhFormEl = document.querySelector('#search-form');
lmBtnEl.style.display = "none";

//console.log(srhFormEl.children[1]);

let page = 1;
let srhValue = '';

const API_KEY = '35244614-3f1384186f27e7cacc119fb8b';
const URL = 'https://pixabay.com/api/';
const options = {
    params: {
        key: API_KEY,
        page: page,
        per_page: 100,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    }
}
console.log(options)
let gallery = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
    captionPosition: 'bottom',
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
});

srhFormEl.addEventListener("submit", (event) => {  
    event.preventDefault();
    page = 1;
    srhFormEl.children[1].setAttribute('disabled', 'true');
    galleryEl.innerHTML = "";
    srhValue = srhFormEl.elements[0].value;
   // const URL = `https://pixabay.com/api/?key=${API_KEY}&q${srhValue}&page=${page}&per_page=40`;
    options.params.q = srhValue;
    axios.get(URL, options)
        .then(function (data) {
            if (data.data.hits.length > 0) { Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`) }
            else { Notiflix.Notify.warning(`Sorry, there are no images matching your search query: "${options.params.q}".`) };
           // console.log(data)
            renderGallery(data);
            if (data.data.totalHits > page * 100) { lmBtnEl.style.display = "flex" }
        }).catch(function (error) {
            console.log("Error");
        }).finally(() => { setTimeout(() => { srhFormEl.children[1].removeAttribute('disabled'); }, 3000); });
});

lmBtnEl.addEventListener("click", () => {

    page += 1;
    options.params.page = page;
    axios.get(URL, options)
        .then(function (data) {
            if (data.data.totalHits < page * 100) {
                lmBtnEl.style.display = "none";
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                return
            };
            console.log(data.data.totalHits, 'pictures:', page * 100);
            renderGallery(data);
        }).catch(function (error) {
            console.log(error.response);
        });
});

function renderGallery(data) {
    let markUp = "";
    markUp = data.data.hits.map((elem) => `<div class="photo-card" >
            <a class="gallery link" href="${elem.largeImageURL}">
            <img src="${elem.webformatURL}" alt="${elem.tags}" width="250" height="200" /> 
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes ${elem.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views ${elem.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments ${elem.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads ${elem.downloads}</b>
                </p>
            </div>
            </div>`).join("");
    galleryEl.style.display = "flex";
    galleryEl.style.flexWrap = "wrap";
    galleryEl.insertAdjacentHTML("beforeend", markUp);
    
    gallery.refresh();

}
