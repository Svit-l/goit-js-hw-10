import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { getRefs } from './getRefs';
const refs = getRefs();
// import { fetchCountriesData } from './renderOneContry';
const BASE_URL = 'https://restcountries.com/v3.1';
// import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

// const fetch = fetchCountries();

refs.searchBox.addEventListener('input', debounce(inputHandling, DEBOUNCE_DELAY));

function inputHandling() {
  const inputData = refs.searchBox.value.trim();
  if (inputData !== '') {
    fetchCountries(inputData)
      .then(countryList)
      .catch(error => Notify.failure(`Oops, there is no country with that name`));
  }
  // console.log(inputData);
  refs.countryList.innerHTML === '';
  return;
}

function fetchCountries(inputData) {
  return fetch(`${BASE_URL}/name/${inputData}?fields=name,capital,population,flags,languages`).then(
    res => {
      if (res.ok) {
        return res.json();
      }
      throw Error(res.statusText);
    },
  );
}

function countryList(countriesData) {
  console.log(countriesData);
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  // console.log(countriesData);
  // console.log(countriesData.length);
  let dataLength = countriesData.length;

  if (dataLength > 1 && dataLength <= 10) {
    const markupCountryList = countriesData
      .map(
        ({ name, flags }) =>
          `<li class="main-data">
          <img class="flag-icon" width="30" height="20" src="${flags.svg}" alt="country flag image"></img>
          <p class="country-list__name">${name.common}</p>
        </li>`,
      )
      .join('');

    refs.countryList.insertAdjacentHTML('beforeend', markupCountryList);
  } else if (dataLength === 1) {
    const languageRef = Object.values(countriesData[0].languages).join(', ');
    console.log(languageRef);

    const markup = countriesData
      .map(
        ({ name, capital, population, flags }) => `
        <div class="main-data">
          <img class="flag-icon" width="60" height="40" src="${flags.svg}" alt="country flag image">
          <h1 class="country-name">${name.common}</h1>
        </div>
        <ul class="country-data">
            <li class="country-official-name">Official name:<b> ${name.official}</b></li>
            <li class="country-capital">Capital: <b> ${capital}</b></li>
            <li class="country-population">Population: <b>${population}</b></li>
            <li class="country-languages">Languages: <b>${languageRef}</b></li>
        </ul>`,
      )
      .join('');
    refs.countryInfo.innerHTML = markup;
  } else {
    refs.countryList.innerHTML = '';
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
}
