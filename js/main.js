const DAY_OF_A_WEEK = {
  1: "Понеділок",
  2: "Вівторок",
  3: "Середа",
  4: "Четвер",
  5: "П'ятниця",
  6: "Субота",
  7: "Неділя",
};
const MONTH_OF_A_YEAR = {
  1: "Січня",
  2: "Лютого",
  3: "Березня",
  4: "Квітня",
  5: "Травня",
  6: "Червня",
  7: "Липня",
  8: "Серпня",
  9: "Вересня",
  10: "Жовтня",
  11: "Листопада",
  12: "Грудня",
};

const container = document.querySelector(".links-container");
const headerClock = document.querySelector("#header-clock");

function formatNumber(num, size = 2) {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: size,
    useGrouping: false,
  });
}

var createLinkElements = (linksArray) => {
  linksArray.forEach((link) => {
    let linkElement = document.createElement("div");
    linkElement.className = "link-card";
    linkElement.innerHTML = `
          <a class="link-main-information" href="${link.links[0]}">
          <img class="link-preview" src="./src/img/${
            link.preview ? link.preview : "link.png"
          }" alt=""></img>
          <div class="link-name">${link.name}</div>
         
      </a>
      `;
    container.appendChild(linkElement);
  });
};

var updateTime = () => {
  var time = new Date();
  var curTime = `${formatNumber(time.getHours())}:${formatNumber(
    time.getMinutes()
  )}:${formatNumber(time.getSeconds())}`;
  var curDate = ` ${DAY_OF_A_WEEK[time.getDay()]} ${time.getDate()} ${
    MONTH_OF_A_YEAR[time.getMonth() + 1]
  }`;
  headerClock.innerText = curDate + "\t" + curTime;
};

fetch("./src/links-list.json")
  .then((resp) => resp.json())
  .then((links) => createLinkElements(links));

updateTime();
const timeInterval = setInterval(updateTime, 1000);
