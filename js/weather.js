const OWAK = "d079728d9385e995c4273bb215a58c03";
const coord = { lat: 49.171, lon: 23.1726 };
let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${OWAK}&lang=ua&units=metric`;
// let url = `http://api.openweathermap.org/data/2.5/forecast?id=${city_IDs.boryslav}&appid=${API_KEY}&lang=ua&units=metric`;
let curDayNum = new Date().getDay();
const weather = [];

function parseWeather(weatherJSON) {
  weatherJSON["daily"].forEach((day) => {
    let dayWeather = {
      minTemp: Math.round(day["temp"]["min"]),
      maxTemp: Math.round(day["temp"]["max"]),
      humidity: day["humidity"],
      weather: day["weather"][0]["description"],
      iconName: day["weather"][0]["icon"],
      precipitationProb: Math.round(day["pop"] * 100) ?? 0,
    };
    weather.push(dayWeather);
  });
  createWeatherCards(weather);
}

function createWeatherCards(weather) {
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
  fetch(url)
    .then((resp) => resp.json())
    .then((respJSON) => parseWeather(respJSON));
}
getWeather();
