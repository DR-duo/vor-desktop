// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const runeterra = require("./app/utils/Runeterra/Runeterra");
const mouse = require("./app/utils/Mouse/Mouse");
const Synth = require("./app/utils/Sound/BrowserSynth");

let lastCardClick = null;
let isActive = false;
let language = "en_us";

const synth = new Synth();


async function eventClick(event) {
  const { x, y, button } = event;
  const card = await runeterra.getCardAtCoord(x, y);
  console.log(lastCardClick, card);
  if (lastCardClick) {
    const { CardID: id } = card;
    const { CardID: lastId } = lastCardClick;

    if (id === lastId) {
      synth.say(card.CardCode);
    }

    lastCardClick = null;
  } else {
    lastCardClick = card || null;
  }
}

mouse.initialize();
mouse.registerEvent("mouseclick", eventClick);
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("vor-button");
  const status = document.getElementById("vor-status");
  const select = document.getElementById("vor-language");
  const languages = [
    { code: "en_us", text: "English US" },
    { code: "fr_fr", text: "French" }
  ];

  button.innerText = "Start";
  status.innerText = "Inactive";
  for (const language of languages) {
    select.add(new Option(language.text, language.code));
  }

  button.addEventListener("click", () => {
    isActive = !isActive;
    button.innerText = isActive ? "Pause" : "Start";
    status.innerText = isActive ? "Active" : "Inactive";
  });

  select.addEventListener("change", () => {
    language = select.options[select.selectedIndex].value;
  });
});
