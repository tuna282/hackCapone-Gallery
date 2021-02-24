import './styles/main.scss';

const submitButton = document.getElementById('search-button');
const input = document.getElementById('search');
const dropdownContent = document.querySelector('.dropdown-content');
const figure = document.getElementById('img-container');
const form = document.getElementById('form')
const dropdownContainer = document.querySelector('.dropdown')
const searches = JSON.parse(localStorage.getItem('searchHistory'));
let page = 1;

const createButtons = () => {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = `<button onclick="renderPrevPage()" class="button--prev">Previous</button>
  <button onclick="renderNextPage()" class="button--next">Next</button>`;
};

input.addEventListener('focus', (event) => {
  dropdownContent.classList.add('toggle-dropdown')
  const storedSearches = JSON.parse(localStorage.searchHistory)
  console.log(storedSearches)
  dropdownContent.innerHTML = `<p>${storedSearches[0]}</p><p>${storedSearches[1]}</p><p>${storedSearches[2]}</p>`
})

dropdownContent.addEventListener('click', (e) => {
  const newSearch = e.target.textContent
  input.value = newSearch;
  dropdownContent.classList.remove('toggle-dropdown')
})

input.addEventListener('blur', () => {
  dropdownContent.classList.remove('toggle-dropdown')
}, true)


const renderPage = data => {

  figure.innerHTML = '';
  data.results.forEach(image => {
    if (!image.description) {
      image.description = 'No description';
    }
    figure.innerHTML += `
      <div class="img-box">
        <div class="img-box--inner">
          <div class="card-front">
            <img class="images" src="${image.urls.small}" alt="${image.description}">
          </div>
          <div class="card-back">
            <p class="img-description">${image.description}</p>
            <p class="img-user">Uploaded by: ${image.user.name}</p>
          </div>
        </div>
      </div>`;
  });

    if (data.total_pages === 1 || !input.value) {
    return true;
  } else if (page === 1) {
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
  if (!localStorage.getItem('searchHistory')) {localStorage.searchHistory = JSON.stringify([])}
  if (input.value) {searches.unshift(input.value)}
  localStorage.setItem('searchHistory', JSON.stringify(searches))
 
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}`, {
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
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}`, {
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
  fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input.value}`, {
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
