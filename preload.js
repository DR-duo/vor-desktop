// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const runeterra = require("./app/utils/Runeterra/Runeterra");
const mouse = require("./app/utils/Mouse/Mouse");
const Synth = require("./app/utils/Sound/BrowserSynth");
const { langs } = require("./config.js");

let lastCardClick = null;
let isActive = false;
let language = Object.keys(langs)[0]; // eslint-disable-line

const synth = new Synth();

async function eventClick(event) {
  const { x, y } = event;
  const card = await runeterra.getCardAtCoord(x, y);
  console.log(lastCardClick, card);
  if (lastCardClick) {
    const { CardID: id } = card;
    const { CardID: lastId } = lastCardClick;

    if (id === lastId) {
      synth.say(card.name);
    }

    lastCardClick = null;
  } else {
    lastCardClick = card || null;
  }
}

//
mouse.initialize();
mouse.registerEvent("mouseclick", eventClick);

window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("vor-button");
  const status = document.getElementById("vor-status");
  const select = document.getElementById("vor-language");

  button.innerText = "Start";
  status.innerText = "Inactive";
  Object.entries(langs).forEach(lang => {
    select.add(new Option(lang[1], lang[0]));
  });

  button.addEventListener("click", () => {
    isActive = !isActive;
    button.innerText = isActive ? "Pause" : "Start";
    status.innerText = isActive ? "Active" : "Inactive";
  });

  select.addEventListener("change", () => {
    language = select.options[select.selectedIndex].value;
  });
});
