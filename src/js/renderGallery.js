import refs from "./refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let gallery = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
    captionPosition: 'bottom',
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
});

export function renderGallery(pictures) {
    let markUp = "";
    markUp = pictures.data.hits.map((elem) => `<div class="photo-card">
            <a class="gallery link" href="${elem.largeImageURL}">
            <img src="${elem.webformatURL}" alt="${elem.tags}" width="250" height="200" loading="lazy"/> 
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
    refs.galleryEl.style.display = "flex";
    refs.galleryEl.style.flexWrap = "wrap";
    refs.galleryEl.style.justifyContent = "center";
    refs.galleryEl.insertAdjacentHTML("beforeend", markUp);
    gallery.refresh();

   // observer.observe(refs.galleryEl.lastChild);
}

export function renderInfoline(qqpict, pictTotal) {
    refs.foundPict.style.display = "flex";
    refs.loadPict.style.display = "flex";
    refs.foundPict.textContent = `Found pictures :${qqpict}`;
    refs.loadPict.textContent = `Load pictures :${pictTotal}`;
}