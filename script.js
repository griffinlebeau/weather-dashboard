const currentContainer = document.getElementById('current-container');
const forecastContainer = document.getElementById('forecast-container');
const searchHistory = document.getElementById('search-history');
const cityInputEl = document.getElementById('city');
const searchBtn = document.getElementById('search-btn');
const apiKey = "831b0b67d8d15789fe6bb9be743cf93a";
const userFormEl = document.getElementById('city-form');

function unixCon(time){
    let unix = time;
    var date = new Date(unix * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return(month + "/" + day + "/" + year)
}

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
    var nameDate = document.createElement('h3');
    nameDate.textContent = city + " " + unixCon(current.dt);
    currentContainer.appendChild(nameDate)
    var temp = document.createElement('p');
    temp.textContent = "Temp: " + current.temp + "F";
    currentContainer.appendChild(temp);
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + current.humidity + "%";
    currentContainer.appendChild(humidity);
    var wind = document.createElement('p');
    wind.textContent = "Wind: " + current.wind_speed + "mph";
    currentContainer.appendChild(wind);
    var icon = document.createElement('img');
    icon.setAttribute("src", "https://openweathermap.org/img/wn/" + current.weather[0].icon + ".png")
    currentContainer.appendChild(icon);
    var uvi = document.createElement('p');
    uvi.textContent = "UV index: " + current.uvi;
    if(current.uvi < 3){
        uvi.classList = "border border-success ";
    } else if(current.uvi < 5){
        uvi.classList = "border border-warning";
    } else {
        uvi.classList = "border border-danger";
    }
    currentContainer.appendChild(uvi);
};

function futureWeather(days){
    for(i = 1; i < days.length; i++){
        var dayDiv = document.createElement('div');
        var date = document.createElement('h4');
        date.textContent = unixCon(days[i].dt);
        dayDiv.appendChild(date);
        var temp = document.createElement('p');
        temp.textContent = "Temp: " + days[i].temp.day + "F";
        dayDiv.appendChild(temp);
        var humidity = document.createElement('p');
        humidity.textContent = "Humidity: " + days[i].humidity + "%";
        dayDiv.appendChild(humidity);
        var wind = document.createElement('p');
        wind.textContent = "Wind: " + days[i].wind_speed + "mph";
        dayDiv.appendChild(wind);
        var icon = document.createElement('img');
        icon.setAttribute("src", "https://openweathermap.org/img/wn/" + days[i].weather[0].icon + ".png")
        dayDiv.appendChild(icon);
        dayDiv.classList = "m-3"
        forecastContainer.appendChild(dayDiv);
    }
};

function displayWeather(data, city){
    var current = data.current;
    var days = data.daily;
    currentWeather(current, city);
    futureWeather(days);
}

function getCityWeather(data, city){
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&units=imperial" + "&appid=" + apiKey;
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
    console.log(city);
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    console.log(apiUrl);
    fetch(apiUrl).then(function(response){
            response.json().then(function(data){
                getCityWeather(data, city);
            })
        })
            
}

saveSearch = city => {
    var searchEl = document.createElement('li');
    searchEl.textContent = city;
    searchEl.addEventListener('click', function(){
        cityInputEl.value = city
    });
    citiesArr.push(city);
    localStorage.setItem("cities", JSON.stringify(citiesArr));
    searchHistory.appendChild(searchEl);
    }

var citiesArr = JSON.parse(localStorage.getItem("cities"));


function loadSearch(citiesArr){
    if (!citiesArr){
        citiesArr = []
        localStorage.setItem("cities", JSON.stringify(citiesArr));
    } else { 
        for(i = 0; i < citiesArr.length; i++){
            var searchEl = document.createElement('li');
            searchEl.textContent = citiesArr[i];
            searchEl.addEventListener('click', function(){
                cityInputEl.value = searchEl.textContent
            })
            searchHistory.appendChild(searchEl);
    }
}}

function formSubmitHandler(event){
    event.preventDefault();
    clearWeather();
    var city = cityInputEl.value.trim();
    console.log(city);
    getCityCoords(city);
    saveSearch(city)
}

function clearWeather(){
    while(currentContainer.hasChildNodes()){
        currentContainer.removeChild(currentContainer.firstChild);
    };
    while(forecastContainer.hasChildNodes()){
        forecastContainer.removeChild(forecastContainer.firstChild);
    };
}

userFormEl.addEventListener("submit", formSubmitHandler);

loadSearch(citiesArr)