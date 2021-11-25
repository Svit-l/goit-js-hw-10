import debounce from 'lodash.debounce';
import './css/styles.css';
import { getRefs } from './getRefs';

// import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = getRefs();
// const fetch = fetchCountries();

refs.searchBox.addEventListener('input', debounce(inputHandling, DEBOUNCE_DELAY));

function inputHandling() {
  let inputData = '';
  inputData += refs.searchBox.value.trim();
  // refs.countryList.textContent = inputData;
  // console.log(inputData);
  fetchCountries(inputData).then(countryList);
}

function fetchCountries(inputData) {
  return fetch(`https://restcountries.com/v2/name/${inputData}`).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw Error(res.statusText);
  });
}

function countryList(countryData) {
  // refs.searchBox.removeEventListener('input', inputHandling);
  // console.log(countryData);
  let firstMarkup = countryData
    .map(
      ({ name, flag }) =>
        `<li class="main-data">
          <img class="flag-icon" width="30" height="20" src="${flag}" alt="country flag image"></img>
          <p class="country-list__name">${name}</p>
        </li>`,
    )
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', firstMarkup);
  // console.log(result);
}

// const countryName = countryData.name['common'];
//const countryFlags = countryData.flags.svg;
