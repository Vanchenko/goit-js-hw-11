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

console.log(srhFormEl.children[1]);


const API_KEY = '35244614-3f1384186f27e7cacc119fb8b';
let page = 1;
let srhValue = '';
let gallery = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
    captionPosition: 'bottom',
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
});

srhFormEl.addEventListener("submit", searchForm);

function searchForm(event) {  
    event.preventDefault();
    srhFormEl.children[1].setAttribute('disabled', 'true');
    galleryEl.innerHTML = "";
    let markUp = "";
    srhValue = srhFormEl.elements[0].value;
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${srhValue}&page=${page}&per_page=40`;
    axios.get(URL)
        .then(function (data) {
            console.log(data.data)
            markUp = data.data.hits.map((elem) => `<div class="photo-card" >
            <a class="gallery link" href="${elem.largeImageURL}">
            <img src="${elem.webformatURL}" alt="${elem.tags}" width="250" height="200"  /> 
            </a>
            </div>`).join("");
            galleryEl.style.display = "flex";
            galleryEl.style.flexWrap = "wrap";
            galleryEl.insertAdjacentHTML("beforeend", markUp);
            lmBtnEl.style.display = "flex";
            Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
            gallery.refresh();
            setTimeout(() => { srhFormEl.children[1].removeAttribute('disabled'); }, 3000);
            //srhFormEl.children[1].removeAttribute('disabled');
        });
};

lmBtnEl.addEventListener("click", () => {
    page += 1;
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${srhValue}&page=${page}&per_page=40`;
    axios.get(URL)
        .then(function (data) {
            markUp = data.data.hits.map((elem) => `<div class="photo-card" >
            <a class="gallery link" href="${elem.largeImageURL}">
            <img src="${elem.webformatURL}" alt="${elem.tags}" width="250" height="200"  /> 
            </a>
            </div>`).join("");
            galleryEl.style.display = "flex";
            galleryEl.style.flexWrap = "wrap";
            galleryEl.insertAdjacentHTML("beforeend", markUp);
            gallery.refresh();
        });
});

