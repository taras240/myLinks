const MAIN_LIST_NAME = "links-list";
const CUR_VERSION = 1;
const MIN_VERSION = 1;
let SHOW_HIDDEN = false; // localStorage.getItem("SHOW_HIDDEN") === "true";
if (localStorage.length === 0 || +localStorage.getItem("ver") < MIN_VERSION) {
  console.log("loading data...");
  let jsonName = MAIN_LIST_NAME;
  saveLinksToLocalStorage(jsonName, () => {
    let list = JSON.parse(localStorage.getItem(jsonName));
    list?.forEach((link) => {
      if (link.type === "folder")
        saveLinksToLocalStorage(link.listName, () =>
          console.log(link.listName)
        );
    });
    updateLinksList();
  });
  localStorage.setItem("ver", CUR_VERSION);
}
//////////////////////////////////////////
//////   READ LINKS FROM JSON        /////
//////////////////////////////////////////

function readLinksFromJSON({ jsonName, container }) {
  let jsonElements = JSON.parse(localStorage.getItem(jsonName));
  jsonElements?.forEach((link, i) => {
    let element = parseElement({ link: link, index: i, listName: jsonName });
    element ? container.appendChild(element) : "";
  });
}

function parseElement({ showHidden = SHOW_HIDDEN, link, listName, index = 1 }) {
  switch (link.type) {
    case "folder":
      return makeFolderElement(link, index, listName);
    case "addCustom":
      return makeCustomElement();
    default:
      return makeLinkElement(link, index, listName);
  }
}
function makeLinkElement(link, index, listName) {
  if (!SHOW_HIDDEN && link.hidden === true) return;
  let linkElement = document.createElement("div");
  linkElement.className = "link-card";
  linkElement.setAttribute("data-index", index);
  linkElement.setAttribute("data-folder", listName);
  linkElement.innerHTML = `
        <a class="link-main-information" href="${link.links[0]}">
        <img class="link-preview" src="${
          link.preview ? link.preview : "./src/img/link.png"
        }" alt=""></img>
        <div class="link-name">${link.name}</div>       
    </a>
    `;
  linkElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    removeElementByIndex(
      event.target.closest(".link-card").dataset.index,
      listName
    );
  });
  return linkElement;
}
function makeFolderElement(folder, index, listName) {
  let folderElement = document.createElement("div");
  folderElement.className = "folder-card";
  folderElement.setAttribute("data-index", index);
  folderElement.setAttribute("data-folder", listName);

  if (!SHOW_HIDDEN && folder.hidden === true) {
    folderElement.classList.add("hidden");
  }
  folderElement.setAttribute("data-private", folder.hidden);
  folderElement.innerHTML = `
        <a class="link-main-information">
        <img class="link-preview" src="${
          folder.preview ? folder.preview : "./src/img/folde.png"
        }" alt=""></img>
        <div class="link-name">${folder.name}</div>       
    </a>
    `;
  folderElement.addEventListener("click", () => {
    openFoler(folder);
  });
  folderElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    removeElementByIndex(
      event.target.closest(".folder-card").dataset.index,
      listName,
      folder
    );
  });
  return folderElement;
}
function makeCustomElement(listName) {
  let creationElement = document.createElement("div");
  creationElement.className = "creation-card";
  // creationElement.setAttribute("list-name", listName);
  creationElement.innerHTML = `
        <a class="link-main-information">
        <img class="link-preview" src="./src/img/add.png" alt=""></img>   
        <div class="link-name">Create element</div>           
    </a>    
    `;
  creationElement.addEventListener("click", () => {
    openCreation(listName);
  });
  return creationElement;
}

function saveLinksToLocalStorage(jsonName, fun) {
  fetch(`./src/${jsonName}.json`)
    .then((resp) => resp.json())
    .then((resp) => {
      localStorage.setItem(jsonName, JSON.stringify(resp));
      fun();
    });
}
function openLinkList(linksListName, container) {
  readLinksFromJSON({ jsonName: linksListName, container: container });
  container.appendChild(makeCustomElement(linksListName));
  // if (!localStorage.getItem(linksListName)) {
  //   saveLinksToLocalStorage(linksListName, () =>
  //     readLinksFromJSON({ jsonName: linksListName, container: container })
  //   );
  // } else {
  //   readLinksFromJSON({ jsonName: linksListName, container: container });
  // }
}

openLinkList(MAIN_LIST_NAME, linksContainer);

//////////////////////////////////////////////
//////     ADD EVENTS LISTINERS     //////////
//////////////////////////////////////////////

/// PRESS SOME BUTTON EVENTS       ///////////
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "NumLock":
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
      // console.log(e.code);
      break;
  }
});

////  CLOSE FOLDER BUTTON    ///////////////
document.querySelector(".close-folder_button").addEventListener("click", () => {
  closeFolder();
});
////  CLOSE CREATION BUTTON  ///////////////
document
  .querySelector(".close-creation_button")
  .addEventListener("click", () => {
    closeCreation();
  });
////   SAVE CREATION BUTTON   //////////////

function removeElementByIndex(index, listName, folder) {
  let curList = JSON.parse(localStorage.getItem(listName));
  curList.splice(index, 1);
  localStorage.setItem(listName, JSON.stringify(curList));
  if (folder) {
    localStorage.removeItem(folder);
  }
  updateLinksList(listName);
}
function addNewElementToList(element, listName) {
  let curList = JSON.parse(localStorage.getItem(listName));
  curList.push(element);
  localStorage.setItem(listName, JSON.stringify(curList));
}
function updateLinksList(listName = MAIN_LIST_NAME) {
  if (listName === MAIN_LIST_NAME) {
    linksContainer.innerHTML = "";
    openLinkList(listName, linksContainer);
  } else {
    openFoler({ name: listName });
  }
}
function saveElement() {
  let listName = creationContainer.getAttribute("list-name");
  let newElement = {
    listName: document.querySelector("#new-element-label").value,
    name: document.querySelector("#new-element-label").value,
    preview: document.querySelector("#new-element-preview").value,
    description: document.querySelector("#new-element-description").value,
    links: [document.querySelector("#new-element-url").value],
    type: document.querySelector(".radio-link-type").checked
      ? "link"
      : "folder",
    // hidden: document.querySelector("new-element-visibility").checked,
  };
  if (verifyNewElementData(newElement, listName)) {
    addNewElementToList(newElement, listName);
    updateLinksList();
  }
}
var verifyNewElementData = (element, listName) => {
  if (element.type === "link") {
    return (
      /.+/g.test(element.name) &&
      /^(http)s{0,1}\:\/\/[^\s]+\.[^\s]+$/gi.test(element.links[0])
    );
  }
  if (element.type === "folder") {
    let isOK = /.+/g.test(element.name) && listName === MAIN_LIST_NAME;
    isOK = !JSON.parse(localStorage.getItem(MAIN_LIST_NAME)).some(
      (item) => item.type === "folder" && item.listName === element.listName
    );
    if (isOK) localStorage.setItem(element.name, "[]");
    return isOK;
  }
};

////////////////////////////////////////////
/////   ADDITIONAL FUNCTIONS     ///////////
////////////////////////////////////////////

////   OPEN / CLOSE FOLDER    //////////////////////
function openFoler(folder) {
  console.log(folder);

  closeFolder();
  closeCreation();
  if (!folderContainer.classList.contains("active")) {
    document.querySelector(".folder-header").innerText = folder.name;
    folderContainer.classList.add("active");
    openLinkList(folder.listName ?? folder.name, folderLinkContainer);
  } else {
    closeFolder();
  }
}
function closeFolder() {
  folderContainer.classList.remove("active");
  folderLinkContainer.innerHTML = "";
}

function openCreation(listName) {
  closeFolder();
  closeCreation();
  creationContainer.classList.add("active");
  creationContainer.setAttribute("list-name", listName);
}
function closeCreation() {
  creationContainer.classList.remove("active");
}
