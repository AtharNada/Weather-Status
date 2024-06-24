let getWeather = document.getElementById('getWeather');
getWeather.addEventListener('click', weather)

function weather() {
    let apiKey = '5234b02b9e2a9bfb59e461aebeab6248';
    let city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=3&APPID=${apiKey}`;

    Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
    ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            displayWeather(data[0]);
            displaydailyForecast(data[1].list);
        })
        .catch(error => {
            console.error('Error Fetching Weather Data:', error);
            alert('Error Fetching Weather Data.Please try Again.');
        })
}

function displayWeather(data) {
    let tempDivInfo = document.getElementById('temp-div');
    let weatherInfoDiv = document.getElementById('weather-info');
    let weatherIcon = document.getElementById('weather-icon');
    let dailyForecastDiv = document.getElementById('daily-forecast');
    weatherInfoDiv.innerHTML = '';
    dailyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        let cityName = data.name;
        let temperature = Math.round(data.main.temp - 273.15);
        let description = data.weather[0].description;
        let iconCode = data.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        let temperatureHTML = `
        <p>${temperature}℃</p>`;
        let weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>`;
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        showImage();
    }
}
function displaydailyForecast(dailyData) {
    let dailyForecastDiv = document.getElementById('daily-forecast');
    dailyForecastDiv.innerHTML = '';
    let next3Days = dailyData.slice(0, 3);
    let today = new Date().getDay();
    next3Days.forEach((day, index) => {
        let daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let dayOfWeekIndex = (today + index) % 7;
        let dayOfWeek = daysOfWeek[dayOfWeekIndex];
        let temperature = Math.round(day.main.temp - 273.15);
        let humidity = day.main.humidity;
        let wind = day.wind.speed;
        let iconCode = day.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        let dailyItemHtml = `
        <div class="daily-item">
        <span>${dayOfWeek}</span>
        <img src="${iconUrl}" alt="daily Weather Icon">
        <span>${temperature}℃</span>
        <span>☂${humidity}%</span>
        <span>💨${wind}km/h</span>
        </div>`;
        dailyForecastDiv.innerHTML += dailyItemHtml;
    })
}
function showImage() {
    let weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}