import { serviceGallery } from './js/api';
import { createMarkup } from './js/markup';
import { failure, success, msg } from './js/notiflix';
import { lightbox } from './js/lightbox';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let page = 1;
let keySearch = '';
let per_page = 20;

refs.btnLoadMore.classList.add('load-more-hidden');

refs.searchForm.addEventListener('submit', handleGallery);

function handleGallery(event) {
  event.preventDefault();
  keySearch = event.target.searchQuery.value.trim();
  if (keySearch === '') {
    failure(msg.searchAgain);
    return;
  }
  serviceGallery(keySearch, (page = 1), per_page)
    .then(data => {
      if (data.hits.length === 0) {
        failure(msg.notFound);
        refs.gallery.innerHTML = '';
        refs.btnLoadMore.classList.add('load-more-hidden');
      } else {
        refs.gallery.innerHTML = createMarkup(data.hits);
        lightbox.refresh();
        const msg = `Hooray! We found ${data.totalHits} images.`;
        success(msg);
      }
      if (data.totalHits / data.hits.length > 1) {
        refs.btnLoadMore.classList.remove('load-more-hidden');
        refs.btnLoadMore.addEventListener('click', handleLoadMore);
        autoScroll();
      } else {
        refs.btnLoadMore.classList.add('load-more-hidden');
        window.scrollTo(0, 0);
      }
    })
    .catch(error => {
      failure(msg.error);
    })
    .finally(() => {
      refs.searchForm.reset();
    });
}

function handleLoadMore() {
  page += 1;
  refs.btnLoadMore.disabled = false;
  serviceGallery(keySearch, page, per_page)
    .then(data => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      lightbox.refresh();
      autoScroll();
      const lastPage = Math.ceil(data.totalHits / per_page);
      if (page === lastPage) {
        endPages();
        return;
      }
    })
    .catch(error => {
      failure(msg.error);
    });
}

function endPages() {
  refs.btnLoadMore.classList.add('load-more-hidden');
  refs.btnLoadMore.removeEventListener('click', handleLoadMore);
  failure(msg.theEnd);
}

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
