const currentContainer = document.getElementById('current-container');
const forecastContainer = document.getElementById('forecast-container');
const searchHistory = document.getElementById('search-history');
const cityInputEl = document.getElementById('city')
const apiKey = 

function pastSearches() {
    var citiesArr = JSON.parse(localStorage.getItem("cities"));
    if (citiesArr){
        for(i = 0; i < citiesArr.length; i++){
            var list = document.createElement('li');
            list.textContent = citiesArr[i];
            list.addEventListener('click', function(){
                cityInputEl.value = citiesArr[i];
            });
            searchHistory.appendChild(list);
        }
    }
}

function currentWeather(current, city){
    var name = document.createElement('h3');
    name.textContent = city;
    currentContainer.appendChild(name)
    var temp = document.createElement('p');
    temp.textContent = "Temp: " + current.temp + "F";
    currentContainer.appendChild(temp);
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + current.humidity + "%";
    currentContainer.appendChild(humidity);
    var wind = document.createElement('p');
    wind.textContent = "Wind: " + current.wind_speed + "mph";
    currentContainer.appendChild(wind);
    var icon = document.createElement('p');
    icon.textContent = current.weather.icon;
    currentContainer.appendChild(icon);
    var uvi = document.createElement('p');
    uvi.textContent = "UV index: " + current.uvi;
    currentContainer.appendChild(uvi);
};

function futureWeather(days){
    for(i = 0; i < days.length; i++){
        var dayDiv = document.createElement('div');
        var temp = document.createElement('p');
        temp.textContent = "Temp: " + days[i].temp.day + "F";
        dayDiv.appendChild(temp);
        var humidity = document.createElement('p');
        humidity.textContent = "Humidity: " + days[i].humidity + "%";
        dayDiv.appendChild(humidity);
        var wind = document.createElement('p');
        wind.textContent = "Wind: " + days[i].wind_speed + "mph";
        dayDiv.appendChild(wind);
        var icon = document.createElement('p');
        icon.textContent = days[i].weather[0].icon;
        dayDiv.appendChild(icon);
        currentContainer.appendChild(dayDiv);

    }
};

function displayWeather(data, city){
    var current = data.current;
    var days = data.daily;
    currentWeather(current, city);
    futureWeather(days);
}

function getCityWeather(data, city){
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly, alerts&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json()
                    .then(function(data){
                        displayWeather(data, city)
                    }
            )} else {
                alert('Error:' + response.statusText)
            }
        })
}

getCityCoords = city => {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json()
                    .then(function(data){
                        getCityWeather(data, city)}
                    )
            } else {
                alert('Error')
            }
        })
        .catch(function(error){
            alert('Unable to connect')
        })
            
}

saveSearch = city => {
    var searchEl = document.createElement('li');
    searchEl.textContent = city;
    searchEl.addEventListener('click', function(){
        cityInputEl.value = city
    });
    var citiesArr = JSON.parse(localStorage.getItem("cities"));
    if (!citiesArr){
        citiesArr = []
        citiesArr.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
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