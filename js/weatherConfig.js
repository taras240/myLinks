
const weatherConfigElement = ({ API_KEY, lat, lon }) => {
  document.querySelector(".config-window")?.remove();

  const configElement = document.createElement("div");
  configElement.classList.add("config-window")
  configElement.innerHTML = `
        <div class="creation-header_container">
          <h2 class="creation-header">Weather Config</h2>
          <button class="close-creation_button" onclick="this.closest('.config-window')?.remove()"></button>
        </div>
    `;

  document.querySelector(".main_container")?.appendChild(configElement);
}