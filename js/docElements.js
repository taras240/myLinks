//////////////////////////////////////////
//////   ELEMENTS INITIALIZATION     /////
//////////////////////////////////////////
const clockContainer = document.querySelector(".clock_container");
const linksContainer = document.querySelector(".links-container");
const headerClock = document.querySelector("#header-clock");
const folderContainer = document.querySelector(".folder_container");
const folderLinkContainer = document.querySelector(".folder-links");
const creationContainer = document.querySelector(".creator_container");

////        WEATHER ELEMENTS

const weatherContainer = document.querySelector(".weather_container");
const headerWeatherContainer = document.querySelector("#header-weather");
const headerWeatherHint = document.querySelector(".header-weather_hint");

const headerTemp = document.querySelector(".header-temp");
const headerWeatherPrev = document.querySelector(".header-weather_prev");

////        SEARCH

const searchContainer = document.querySelector(".search-bar_container");
const searchBar = document.querySelector("#search-bar");

const generateFolderFormHtml = ({ folderName = "folder" }) => `

    <h2 class="folder-header">${folderName}</h2>
    <div class="folder-links"></div>
    <button class="close-folder_button" onclick="closeFolder()">X</button>

`;

const generateCreationFormHtml = ({
  headerText = "Створити елемент",
  elementNameText = "",
  elementUrl = "",
  isLink = true,
  isHidden = false,
  iconUrl = "",
  elentDescription = "",
  isEditing = false,
  elementIndex,
}) => `
    
        <h2 class="creation-header">${headerText}</h2>
        <button class="close-creation_button" onclick="closeCreation()">X</button>
        <div class="creation-form">
            <div class="">
                <input type="text" placeholder="Назва елемента" id="new-element-label" name="elementLabel" value="${elementNameText}">
            </div>

        <div class="element-type-selection">
            <div>
                <input type="radio" class="radio-link-type" id="link" name="element-type" value="link" ${
                  isLink ? "checked" : ""
                }>
                <label for="link">Посилання</label>
                <input type="text" placeholder="https://..........." id="new-element-url" name="link-url" value="${elementUrl}">
            </div>
            <div>
                <input type="radio" class="radio-folder-type" id="folder" name="element-type" value="folder" ${
                  !isLink ? "checked" : ""
                }>
                <label for="folder">Папка</label>
            </div>
            <div class="">
                <input type="checkbox" id="new-element-visibility" name="visibility" value="hidden" ${
                  isHidden ? "checked" : ""
                }>
                <label for="new-element-visibility">Прихований</label>
            </div>
        </div>
        <div class="">
            <input type="text" placeholder="Посилання на значок" id="new-element-preview" name="preview-url" value="${iconUrl}">
        </div>
        <div class="">
            <input type="text" placeholder="Опис" name="description" id="new-element-description" value="${elentDescription}">
        </div>
        <button id="saveElement" class="${
          isEditing ? "hidden" : ""
        }"  onclick="saveNewElement()">Зберегти</button>
        <button id="saveElement" class="${
          !isEditing ? "hidden" : ""
        }"  onclick="saveExistingElement(${elementIndex})">Зберегти зміни</button>

        </div>
`;

const generateContextMenuHtml = ({ title = "" }) => `
    <h2 class="context-menu_header">${title}</h2>
    <button class="edit-element_button context-button">Змінити</button>
    <button disabled="" class="icon-element_button context-button">Змінити значок</button>
    <button class="hide-element_button context-button">Приховати</button>
    <button class="delete-element_button context-button">Видалити</button>
`;

const generateLinkElementHtml = ({
  link = "",
  linkPreview = "",
  linkName = "",
}) => `
    <a class="link-main-information" ${link ? 'href="' + link + '"' : ""}>
    <img class="link-preview" src="${
      linkPreview ? linkPreview : "./src/img/link.png"
    }" alt=""></img>
    <div class="link-name">${linkName}</div>       
    </a>
`;
const generateAddNewLinkElement = (listName) => {
  let creationElement = document.createElement("div");
  creationElement.className = "creation-card";
  creationElement.innerHTML = generateLinkElementHtml({
    linkPreview: "./src/img/add.png",
    linkName: "Додати",
  });
  creationElement.addEventListener("click", () => {
    openCreation(listName);
  });
  return creationElement;
};
