let openWeatherConfig;
if (localStorage.hasOwnProperty("openWeatherSettings")) {
  openWeatherConfig = JSON.parse(localStorage.getItem("openWeatherSettings"));
}

function getOWUrl() {
  let url = new URL("onecall", "https://api.openweathermap.org/data/3.0/");
  // Параметри запиту
  let params = {
    lat: openWeatherConfig.lat,
    lon: openWeatherConfig.lon,
    appid: openWeatherConfig.API_KEY,
    lang: "ua",
    units: "metric",
  };
  // Додавання параметрів до URL
  url.search = new URLSearchParams(params);
  return url;
}

let curDayNum = new Date().getDay();
let weather = [];
let currentWeather = {};

function parseWeather(weatherObj) {
  // console.log(weatherJSON);
  const w = weatherObj.current;
  currentWeather = {
    temp: Math.round(w.temp) + "°C",
    iconName: w.weather[0].icon,
    weather: w.weather[0].description,
    humidity: w.humidity + "%",
    feelsTemp: Math.round(w.feels_like) + "°C",
    windSpeed: Math.round(w.wind_speed) + "м/с",
    sunrise: new Date(w.sunrise * 1000),
    sunset: new Date(w.sunset * 1000),
  };
  weatherObj.daily.forEach((day) => {
    let dayWeather = {
      minTemp: Math.round(day.temp.min),
      maxTemp: Math.round(day.temp.max),
      humidity: day.humidity,
      weather: day.weather[0].description,
      iconName: day.weather[0].icon,
      precipitationProb: Math.round(day.pop * 100) ?? 0,
    };

    weather.push(dayWeather);
  });
  updateClockWeather(currentWeather);
  createHeaderWeather(currentWeather);
  createWeatherCards(weather);
}
function updateClockWeather(weather) {
  clockWeatherContainer.innerText = `${weather.weather}, ${weather.temp}`;
}
function createHeaderWeather(currentWeather) {
  // headerTemp.innerText = currentWeather.temp;
  headerWeatherPrev.src = `https://openweathermap.org/img/wn/${currentWeather.iconName}@2x.png`;
  headerWeatherHint.innerHTML = `
    <div class="header-hint_temp">
      Температура: ${currentWeather.temp}
    </div>
    <div class="header-hint_feels-temp">
      Відчувається як: ${currentWeather.feelsTemp}
    </div>
    <div class="header-hint_weather">
      Погода: ${currentWeather.weather}
    </div>
    <div class="header-hint_humidity">
      Вологість: ${currentWeather.humidity}
    </div>
    <div class="header-hint_wind">
      Швидкість вітру: ${currentWeather.windSpeed}
    </div>
    <div class="header-hint_wind">
      Схід сонця: ${currentWeather.sunrise.getHours()}:${currentWeather.sunrise.getMinutes()}
    </div>
    <div class="header-hint_wind">
      Захід сонця: ${currentWeather.sunset.getHours()}:${currentWeather.sunset.getMinutes()}
    </div>          
  `;
}
function createWeatherCards(weather) {
  console.log(weather)
  weather.forEach((day, index) => {
    let curDay =
      DAY_OF_A_WEEK[
      curDayNum + index > 6 ? curDayNum + index - 7 : curDayNum + index
      ];
    let weatherCard = document.createElement("div");
    weatherCard.className = "weather-card card-one";
    weatherCard.innerHTML = `
      <div class="weather-card_day">${curDay}</div>
      <span class="weather-card_min-temp">${day.minTemp}</span> /
      <span class="weather-card_max-temp">${day.maxTemp}</span>

      <img
        class="weather-card_max-icon"
        src="https://openweathermap.org/img/wn/${day.iconName}@2x.png"
        alt=""
        srcset=""
      />
      <div class="weather-card_description">${day.weather}</div>
      <div class="weather-card_precipitation-prob">${day.precipitationProb}%</div>
    `;
    weatherContainer.append(weatherCard);
  });
}

function getWeather() {
  fetch(getOWUrl())
    .then((resp) => resp.json())
    .then((respJSON) => parseWeather(respJSON));
}
getWeather();
