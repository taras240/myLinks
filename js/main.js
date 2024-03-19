const MAIN_LIST_NAME = "links-list";
const CUR_VERSION = 2;
const MIN_VERSION = 2;
let SHOW_HIDDEN = false;

if (localIsGood()) {
  openLinkList(MAIN_LIST_NAME, linksContainer);
} else {
  writeDefaultDataToLocal();
}

function localIsGood() {
  return (
    localStorage.length > 0 &&
    localStorage.getItem("ver") == MIN_VERSION &&
    localStorage.getItem(MAIN_LIST_NAME)
  );
}

function writeDefaultDataToLocal() {
  saveLinksToLocalStorage(MAIN_LIST_NAME, () => {
    let list = JSON.parse(localStorage.getItem(MAIN_LIST_NAME));
    list?.forEach((link) => {
      if (link.type === "folder")
        saveLinksToLocalStorage(link.name, () => console.log("."));
    });
    updateLinksList();
  });
  localStorage.setItem("ver", CUR_VERSION);
}
//////////////////////////////////////////
//////!   READ LINKS FROM JSON        /////
//////////////////////////////////////////

function readLinksFromJSON({ jsonName, container }) {
  let jsonElements = JSON.parse(localStorage.getItem(jsonName));
  jsonElements?.forEach((link, i) => {
    let element = makeElement({
      link: link,
      index: i,
      listName: jsonName,
      parentContainer: container,
    });
    element ? container.appendChild(element) : "";
  });
}

function makeElement({ link, index, listName, parentContainer }) {
  let element = document.createElement("li");
  let type = link.type ?? "link";
  element.className = "link-card"; // link.type === "folder" ? "folder-card" :
  element.dataset.type = type;
  element.classList.add("draggable");
  element.setAttribute("data-index", index);
  element.setAttribute("data-folder", listName);
  element.setAttribute("draggable", "true");
  if (!SHOW_HIDDEN && link.hidden === true) {
    element.classList.add("hidden");
  }
  element.setAttribute("data-private", Boolean(link.hidden));
  element.innerHTML = generateLinkElementHtml({
    link: type === "link" ? link?.href : "",
    linkPreview: link.preview
      ? link.preview
      : link.type === "folder"
      ? "./src/img/folde.png"
      : "",
    linkName: link.name,
  });
  element.addEventListener("contextmenu", (event) => {
    event.stopPropagation();
    event.preventDefault();
    showContextMenu({
      posX: event.clientX,
      posY: event.clientY,
      item: link,
      event: event,
      listName: listName,
    });
  });
  element.addEventListener("dragstart", () => {
    parentContainer.classList.add("draggable-container");
    element.classList.add("dragging");
  });
  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
    changeElementPositionInList({
      element: element,
      link: link,
      listName: listName,
    });
    parentContainer.classList.remove("draggable-container");
  });
  type === "folder"
    ? element.addEventListener("click", (e) => {
        e.stopPropagation();
        openFoler(link);
      })
    : "";
  return element;
}

function makeCustomElement(listName) {
  return generateAddNewLinkElement(listName);
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
  new Sortable(container, {
    animation: 150,
  });
}

//////////////////////////////////////////////
//////!     ADD EVENTS LISTINERS     //////////
//////////////////////////////////////////////

/// PRESS SOME BUTTON EVENTS       ///////////
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyP":
      SHOW_HIDDEN = !SHOW_HIDDEN;
      localStorage.setItem("SHOW_HIDDEN", SHOW_HIDDEN);
      let hiddenElements = document.querySelectorAll("[data-private = 'true']");
      hiddenElements.forEach((el) => {
        SHOW_HIDDEN
          ? el.classList.remove("hidden")
          : el.classList.add("hidden");
      });
    default:
      // console.log(e.code);
      break;
  }
});

////  CLOSE FOLDER BUTTON    ///////////////
document.querySelector(".close-folder_button").addEventListener("click", () => {
  closeFolder();
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
function changeElementPositionInList({ element, listName, link }) {
  let prevPos = +element.dataset.index;
  let newPos;
  if (listName === MAIN_LIST_NAME) {
    newPos = [...linksContainer.querySelectorAll(`[class*="card"]`)].indexOf(
      element
    );
  } else {
    newPos = [
      ...folderLinkContainer.querySelectorAll(`[class*="card"]`),
    ].indexOf(element);
  }
  let tempList = JSON.parse(localStorage.getItem(listName));
  tempList.splice(prevPos, 1);
  tempList.splice(newPos, 0, link);
  localStorage.setItem(listName, JSON.stringify(tempList));
  updateLinksList(listName);
}

function saveNewElement() {
  let listName = creationContainer.getAttribute("list-name");
  let newElement = {
    name: document.querySelector("#new-element-label").value,
    preview: document.querySelector("#new-element-preview").value,
    description: document.querySelector("#new-element-description").value,
    links: [document.querySelector("#new-element-url").value],
    type: document.querySelector(".radio-link-type").checked
      ? "link"
      : "folder",
    hidden: document.querySelector("#new-element-visibility").checked,
  };
  if (verifyNewElementData(newElement, listName)) {
    closeCreation();
    addNewElementToList(newElement, listName);
    if (newElement.type === "folder") {
      localStorage.setItem(newElement.name, "[]");
    }
    updateLinksList();
  }
}
function verifyNewElementData(element, listName) {
  if (element.type === "link") {
    return (
      /.+/g.test(element.name) &&
      /^(http)s{0,1}\:\/\/[^\s]+\.[^\s]+$/gi.test(element.href)
    );
  }
  if (element.type === "folder") {
    let isOK = /.+/g.test(element.name) && listName === MAIN_LIST_NAME;
    isOK = !JSON.parse(localStorage.getItem(MAIN_LIST_NAME)).some(
      (item) => item.type === "folder" && item.name === element.name
    );
    return isOK;
  }
}

////   OPEN / CLOSE FOLDER    //////////////////////
function openFoler(folder) {
  closeFolder();
  closeCreation();
  hideContextMenu();
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
  hideContextMenu();
  creationContainer.classList.add("active");
  creationContainer.setAttribute("list-name", listName);
  creationContainer.innerHTML = generateCreationFormHtml({
    headerText: "Створення нового елемента",
  });
}

function closeCreation() {
  creationContainer.classList.remove("active");
  creationContainer.innerHTML = "";
}
////////////////////////////////////
/// SHOW HIDE CONTEXT MENU /////////

function showContextMenu({ posX, posY, item, event, listName }) {
  hideContextMenu();
  let element = document.createElement("div");
  element.className = "contex-menu";
  element.innerHTML = generateContextMenuHtml({ title: item.name });
  element
    .querySelector(".delete-element_button")
    .addEventListener("click", () => {
      removeElementByIndex(
        event.target.closest(".link-card")?.dataset.index ??
          event.target.closest(".folder-card").dataset.index,
        listName
      );
    });
  element
    .querySelector(".hide-element_button")
    .addEventListener("click", () => {
      hideElementByIndex(
        event.target.closest(".link-card")?.dataset.index ??
          event.target.closest(".folder-card").dataset.index,
        listName
      );
    }); //

  element
    .querySelector(".edit-element_button")
    .addEventListener("click", () => {
      changeElementByIndex({
        index:
          event.target.closest(".link-card")?.dataset.index ??
          event.target.closest(".folder-card").dataset.index,
        listName: listName,
      });
    });
  element.style.top = posY + "px";
  element.style.left = posX + "px";
  linksContainer.appendChild(element);
}
////context menu operations   ////////

function hideElementByIndex(index, listName, folder) {
  let curList = JSON.parse(localStorage.getItem(listName));
  curList[index].hidden = !Boolean(curList[index].hidden);
  localStorage.setItem(listName, JSON.stringify(curList));
  updateLinksList(listName);
}

function saveExistingElement(index) {
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
  };

  if (verifyNewElementData(newElement, listName)) {
    closeCreation();
    let curList = JSON.parse(localStorage.getItem(listName));
    if (newElement.type === "folder") {
      localStorage.setItem(
        newElement.name,
        localStorage.getItem(curList[index].name)
      );
    }
    curList[index] = newElement;
    localStorage.setItem(listName, JSON.stringify(curList));
    updateLinksList();
  }
}
function changeElementByIndex({ index, listName }) {
  let curList = JSON.parse(localStorage.getItem(listName));
  let element = curList[index];
  openCreationForChange({
    element: element,
    listName: listName,
    elementIndex: index,
  });
}
function openCreationForChange({ element, listName, elementIndex }) {
  closeFolder();
  closeCreation();
  creationContainer.classList.add("active");
  creationContainer.setAttribute("list-name", listName);
  creationContainer.innerHTML = generateCreationFormHtml({
    headerText: "Редагування елемента",
    elementNameText: element.name,
    elementUrl: Array.isArray(element?.links) ? element?.href : "",
    isLink: element.type !== "folder",
    isHidden: Boolean(element.hidden),
    iconUrl: element.preview,
    elentDescription: element.description,
    isEditing: true,
    elementIndex: elementIndex,
  });
}
function hideContextMenu() {
  let menuElement = document.querySelector(".contex-menu");
  menuElement?.remove();
}
document.addEventListener("click", () => {
  hideContextMenu();
  // console.log("click");
  // closeCreation();
  closeFolder();
});
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  hideContextMenu();
  let exportMenu = generateExportMenuElement();
  document.querySelector("header").appendChild(exportMenu);
});
function loadData() {
  document.getElementById("file-input").click();
  document.getElementById("file-input").addEventListener("change", function () {
    let file = this.files[0];

    const reader = new FileReader();
    reader.onload = function () {
      // Отримайте текстовий вміст файлу з FileReader-об'єкта
      const textContent = JSON.parse(reader.result);
      let fileVer;
      textContent.forEach((file) => {
        if (file.name === "ver") fileVer = file.value;
      });
      if (fileVer != MIN_VERSION) {
        console.error("links version error");
        return;
      }
      textContent.forEach((file) => {
        localStorage.setItem(file.name, file.value);
      });
    };
    // Прочитайте файл
    reader.readAsText(file);
    setTimeout(() => updateLinksList(MAIN_LIST_NAME), 1000);
  });
}
function exportData() {
  let date = new Date().toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  let localData = [];
  Object.getOwnPropertyNames(localStorage).forEach((el) =>
    localData.push({ name: el, value: localStorage.getItem(el) })
  );

  const text = JSON.stringify(localData);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${date}-linksExport.json`;
  link.click();

  URL.revokeObjectURL(url);
}
document.querySelector("header").addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
