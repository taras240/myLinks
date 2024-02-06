//////////////////////////////////////////
//////   ELEMENTS INITIALIZATION     /////
//////////////////////////////////////////

const linksContainer = document.querySelector(".links-container");
const headerClock = document.querySelector("#header-clock");
const folderContainer = document.querySelector(".folder_container");
const folderLinkContainer = document.querySelector(".folder-links");
const creationContainer = document.querySelector(".creator_container");

////        WEATHER ELEMENTS

const weatherContainer = document.querySelector(".weather_container");
const weatherCards = [];
document.querySelectorAll(".weather-card").forEach((card) => {
  let dayCard = {
    day: card.querySelector(".weather-card_day"),
    minTemp: card.querySelector(".weather-card_min-temp"),
    maxTemp: card.querySelector(".weather-card_max-temp"),
    icon: card.querySelector(".weather-card_max-icon"),
    precipitation: card.querySelector(".weather-card_precipitation-prob"),
  };
  weatherCards.push(dayCard);
});
