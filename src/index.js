import './styles/main.scss';

const submitButton = document.getElementById('search-button');
const input = document.getElementById('search');
let page = 1;

const createButtons = () => {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = `<button onclick="renderPrevPage()" class="button--prev">Previous</button>
  <button onclick="renderNextPage()" class="button--next">Next</button>`;
};

const renderPage = data => {
  const figure = document.getElementById('img-container');
  figure.innerHTML = '';
  data.results.forEach(image => {
    figure.innerHTML += `<img src="${image.urls.small}" alt="${image.description}">`;
  });

  if (data.total_pages === 1) {
    return true;
  } if (page === 1) {
    createButtons();
    const prevButton = document.querySelector('.button--prev');
    prevButton.style.display = 'none';
  } else if (page === data.total_pages) {
    createButtons();
    const nextButton = document.querySelector('.button--next');
    nextButton.style.display = 'none';
  } else {
    createButtons();
  }
  return true;
};

submitButton.addEventListener('click', e => {
  e.preventDefault();
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}&orientation=squarish`, {
    method: 'GET',
    headers: {
      Authorization: 'Client-ID sntlYzNOgnb_utk2xCDj-dsqX0BpDi4Tb5cOy2CuXbY',
    },
  })
    .then(res => res.json())
    .then(data => {
      renderPage(data);
    })
    .catch(err => {
      console.error(err.message);
    });
});

const renderNextPage = () => {
  page += 1;
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}&orientation=squarish`, {
    method: 'GET',
    headers: {
      Authorization: 'Client-ID sntlYzNOgnb_utk2xCDj-dsqX0BpDi4Tb5cOy2CuXbY',
    },
  })
    .then(res => res.json())
    .then(newData => {
      renderPage(newData);
    });
};

const renderPrevPage = () => {
  page -= 1;
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}&orientation=squarish`, {
    method: 'GET',
    headers: {
      Authorization: 'Client-ID sntlYzNOgnb_utk2xCDj-dsqX0BpDi4Tb5cOy2CuXbY',
    },
  })
    .then(res => res.json())
    .then(newData => {
      renderPage(newData);
    });
};

window.renderNextPage = renderNextPage;
window.renderPrevPage = renderPrevPage;
