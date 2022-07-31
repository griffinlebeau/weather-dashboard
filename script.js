const currentContainer = document.getElementById('current-container');
const forecastContainer = document.getElementById('forecast-container');
const searchHistory = document.getElementById('search-history');
const cityInputEl = document.getElementById('city')

saveSearch = city => {
    var searchEl = document.createElement('li');
    searchEl.textContent = city;
    searchEl.addEventListener('click', function(){
        cityInputEl.value = city
    });
    var citiesArr = JSON.parse(localStorage.getItem("cities"));
    citiesArr.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    searchHistory.appendChild(searchEl);
}




formSubmitHandler = event => {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    getCityCoords(city);
    saveSearch(city)
}