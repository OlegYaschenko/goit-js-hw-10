import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce((onInput), DEBOUNCE_DELAY));

function onInput(e) {
  const country = e.target.value.trim();
  if (country === '') {
    return;
  }
  fetchCountries(country).then(renderCountries).catch(onFetchError);
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}

function renderCountries(countries) {
  if (countries.status === 404) {
    Notify.failure("Oops, there is no country with that name");
    return;
  }
  if (countries.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    return;
  }
  if (countries.length <= 10 && countries.length >= 2) {
    renderCountriesList(countries);
    return;
  }
  if (countries.length === 1) {
    renderCountryCard(countries);
    return;
  } 
  };

function onFetchError(error) {
  Notify.failure("Oops, there is no country with that name");
};

function renderCountriesList(countries) {
  const markup = countries.map(country =>
    `<li class="list-item"><img class="flag-img" heigth="50px" width="50px"
       src="${country.flags.svg}" alt="${country.name}">${country.name}</li>`).join("");
  
    refs.countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
  const markup = countries.map(country => 
    `<div class="country-card">
    <div class="card-img-top">
      <img  heigth="50px" width="50px" src="${country.flags.svg}" alt="${country.name}">
    </div>
    <div class="card-body">
      <h2 class="card-title">Country: ${country.name}</h2>
      <p class="card-text">Capital: ${country.capital}</p>
      <p class="card-text">Population: ${country.population}</p>
      <p class="card-text"><b>Languages:</b></p>
      <ul class="list-group"></ul>
        <li class="list-group-item">${country.languages.map(lang => lang.name).join(" ")}</li>
      </ul>
    </div>
  </div>`).join("");

  refs.countryCard.innerHTML = markup;
};