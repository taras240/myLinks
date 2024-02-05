let SHOW_HIDDEN = localStorage.getItem("SHOW_HIDDEN") === "true";

//////////////////////////////////////////
//////   READ LINKS FROM JSON        /////
//////////////////////////////////////////

var readLinksFromJSON = ({ jsonName, container }) => {
  let jsonElements = JSON.parse(localStorage.getItem(jsonName));
  jsonElements.forEach((link) => {
    let element = parseElement({ link: link });
    element ? container.appendChild(element) : "";
  });
};

var parseElement = ({ showHidden = SHOW_HIDDEN, link }) => {
  switch (link.type) {
    case "folder":
      return makeFolderElement(link);
    case "addCustom":
      return makeCusstomElement();
    default:
      return makeLinkElement(link);
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
  if (!SHOW_HIDDEN && folder.hidden === true) {
    folderElement.classList.add("hidden");
  }
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
var makeCusstomElement = () => {
  let creationElement = document.createElement("div");
  creationElement.className = "creation-card";

  creationElement.innerHTML = `
        <a class="link-main-information">
        <img class="link-preview" src="./src/img/add.png" alt=""></img>              
    </a>
    `;
  creationElement.addEventListener("click", () => {
    openCreation();
  });
  return creationElement;
};

var saveLinksToLocalStorage = (jsonName, fun) => {
  fetch(`./src/${jsonName}.json`)
    .then((resp) => resp.json())
    .then((resp) => {
      localStorage.setItem(jsonName, JSON.stringify(resp));
      fun();
    });
};
var openLinkList = (linksListName, container) => {
  if (!localStorage.getItem(linksListName)) {
    saveLinksToLocalStorage(linksListName, () =>
      readLinksFromJSON({ jsonName: linksListName, container: container })
    );
  } else {
    readLinksFromJSON({ jsonName: linksListName, container: container });
  }
};

openLinkList("links-list", linksContainer);

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
////  CLOSE CREATION BUTTON  ///////////////
document
  .querySelector(".close-creation_button")
  .addEventListener("click", () => {
    closeCreation();
  });
////   SAVE CREATION BUTTON   //////////////
var verifyNewElementData = () => {
  return true;
};
var saveElement = () => {
  if (verifyNewElementData()) {
    let newElement = {
      name: document.querySelector("#new-element-label").value,
      preview: document.querySelector("#new-element-preview").value,
      description: document.querySelector("#new-element-description").value,
      links: [document.querySelector("#new-element-url").value],
      // hidden: document.querySelector("new-element-visibility").checked,
    };
    console.log(newElement);
    let array = [...JSON.parse(localStorage.getItem("links-list"))];

    console.log(array);
  }
};
document.querySelector("#saveElement").addEventListener("click", () => {
  saveElement();
});

////////////////////////////////////////////
/////   ADDITIONAL FUNCTIONS     ///////////
////////////////////////////////////////////

////   OPEN / CLOSE FOLDER    //////////////////////
var openFoler = (folder) => {
  closeFolder();
  closeCreation();
  if (!folderContainer.classList.contains("active")) {
    document.querySelector(".folder-header").innerText = folder.name;
    folderContainer.classList.add("active");
    openLinkList(folder.listName, folderLinkContainer);
  } else {
    closeFolder();
  }
};
var closeFolder = () => {
  folderContainer.classList.remove("active");
  folderLinkContainer.innerHTML = "";
};

var openCreation = () => {
  closeFolder();
  closeCreation();
  creationContainer.classList.add("active");
};
var closeCreation = () => {
  creationContainer.classList.remove("active");
};
