import Notiflix from 'notiflix';
import refs from './refs';
import { options } from "./requestOptions";
import { loadPictures } from './loadPictures';
import { renderGallery, renderInfoline } from './renderGallery';

Notiflix.Notify.init({
    width: '380px',
    position: 'center-top',
    distance: '55px',
    opacity: 1,
    ID: 'NotiflixNotify',
    className: 'notiflix-notify',
    zindex: 4001,
    fontFamily: 'Quicksand',
    fontSize: '22px',
    cssAnimation: true,
    cssAnimationDuration: 1200,
});

refs.lmBtnEl.style.display = "none";
refs.foundPict.style.display = "none";
refs.loadPict.style.display = "none";
let page = 1;
let pictTotal = 0;
const per_page = options.params.per_page;

const optionsScroll = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0,
}
const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
        page += 1;
        options.params.page = page;
        observer.disconnect();
        loadPictures()
            .then((pictures) => {
                pictTotal = pictTotal + pictures.data.hits.length;
                    if (pictures.data.totalHits < pictTotal) {
                        if (pictures.data.totalHits > per_page) { refs.lmBtnEl.style.display = "flex" };
                        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                        return
                    };
                renderGallery(pictures);
                renderInfoline(pictures.data.totalHits, pictTotal);
                observer.observe(refs.galleryEl.lastChild);
            }).catch((error) => {
                console.log(error.response);
            });
    }
};
const observer = new IntersectionObserver(callback, optionsScroll);

refs.srhFormEl.addEventListener("submit", (event) => {  
    event.preventDefault();
    page = 1;
    options.params.page = page;
    pictTotal = 0;
    refs.lmBtnEl.style.display = "none";
    refs.srhFormEl.children[1].setAttribute('disabled', 'true');
    refs.galleryEl.innerHTML = "";
    refs.foundPict.style.display = "none";
    refs.loadPict.style.display = "none";
    options.params.q = refs.srhFormEl.elements[0].value;
    loadPictures()
        .then((pictures) => {
            if (pictures.data.hits.length > 0) {
                Notiflix.Notify.success(`Hooray! We found ${pictures.data.totalHits} images.`)
                renderGallery(pictures);
                pictTotal = pictTotal + pictures.data.hits.length;
                renderInfoline(pictures.data.totalHits, pictTotal);
                observer.observe(refs.galleryEl.lastChild);
            }
            else { Notiflix.Notify.warning(`Sorry, there are no images matching your search query: "${options.params.q}".`) };
        }).catch((error) => {
            console.log(error);
        }).finally(() => { setTimeout(() => { refs.srhFormEl.children[1].removeAttribute('disabled'); }, 3000); });
});

refs.lmBtnEl.addEventListener("click", () => {
    window.scroll(0,0);
});


