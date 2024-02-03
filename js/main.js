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

//////////////////////////////////////////
//////   ELEMENTS INITIALIZATION     /////
//////////////////////////////////////////

let SHOW_HIDDEN = localStorage.getItem("SHOW_HIDDEN") === "true";
const linksContainer = document.querySelector(".links-container");
const headerClock = document.querySelector("#header-clock");
const folderContainer = document.querySelector(".folder_container");
const folderLinkContainer = document.querySelector(".folder-links");
var myLinks;

function formatNumber(num, size = 2) {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: size,
    useGrouping: false,
  });
}

//////////////////////////////////////////
//////   READ LINKS FROM JSON        /////
//////////////////////////////////////////

var readLinksFromJSON = ({ jsonName, container }) => {
  fetch(`../src/${jsonName}.json`)
    .then((resp) => resp.json())
    .then((links) => {
      links.forEach((link) => {
        let element = parseElement({ link: link });
        element ? container.appendChild(element) : "";
      });
    });
};
var parseElement = ({ showHidden = SHOW_HIDDEN, link }) => {
  switch (link.type) {
    case "folder":
      return makeFolderElement(link);
      break;
    default:
      return makeLinkElement(link);
      break;
  }
};
var makeLinkElement = (link) => {
  if (!SHOW_HIDDEN && link.hidden === true) return;
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
  return linkElement;
};
var makeFolderElement = (folder) => {
  let folderElement = document.createElement("div");
  folderElement.className = "folder-card";
  if (!SHOW_HIDDEN && folder.hidden === true)
    folderElement.classList.add("hidden");
  folderElement.setAttribute("data-private", folder.hidden);
  folderElement.innerHTML = `
        <a class="link-main-information">
        <img class="link-preview" src="./src/img/${
          folder.preview ? folder.preview : "folde.png"
        }" alt=""></img>
        <div class="link-name">${folder.name}</div>
       
    </a>
    `;

  folderElement.addEventListener("click", () => {
    openFoler(folder);
  });
  return folderElement;
};

readLinksFromJSON({ jsonName: "links-list", container: linksContainer });

//////////////////////////////////////////////
//////     ADD EVENTS LISTINERS     //////////
//////////////////////////////////////////////

/// PRESS SOME BUTTON EVENTS       ///////////
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyX":
      SHOW_HIDDEN = !SHOW_HIDDEN;
      localStorage.setItem("SHOW_HIDDEN", SHOW_HIDDEN);
      let hiddenElements = document.querySelectorAll("[data-private = 'true']");
      hiddenElements.forEach((el) => {
        SHOW_HIDDEN
          ? el.classList.remove("hidden")
          : el.classList.add("hidden");
      });
      break;
    default:
      console.log(e.code);
      break;
  }
});

////  CLOSE FOLDER BUTTON    ///////////////
document.querySelector(".close-folder_button").addEventListener("click", () => {
  closeFolder();
});

////////////////////////////////////////////
/////   ADDITIONAL FUNCTIONS     ///////////
////////////////////////////////////////////

////   OPEN / CLOSE FOLDER    //////////////////////
var openFoler = (folder) => {
  if (!folderContainer.classList.contains("active")) {
    document.querySelector(".folder-header").innerText = folder.name;
    folderContainer.classList.add("active");
    readLinksFromJSON({
      jsonName: folder.listName,
      container: folderLinkContainer,
    });
  } else {
    closeFolder();
  }
};
var closeFolder = () => {
  folderContainer.classList.remove("active");
  folderLinkContainer.innerHTML = "";
};

//////   UPDATE TIME  /////////////////////
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
updateTime();
const timeInterval = setInterval(updateTime, 1000);
