// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const runeterra = require("./app/utils/Runeterra/Runeterra");
const mouse = require("./app/utils/Mouse/Mouse");
const Synth = require("./app/utils/Sound/BrowserSynth");
const { langs } = require("./config.js");

let lastCardClick = null;
let isActive = false;

let synth;

async function eventClick(event) {
  const { x, y } = event;
  const card = await runeterra.getCardAtCoord(x, y);

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

// Setup mouse events
mouse.initialize();

// Setup configuration windows
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

    //
    if (isActive) {
      mouse.registerEvent("mouseclick", eventClick);
    } else {
      mouse.unregisterEvent("mouseclick", eventClick);
    }
  });
  select.addEventListener("change", () => {
    const language = select.options[select.selectedIndex].value;
    runeterra.setLanguage(language);
  });
});

window.addEventListener("load", () => {
  // syntheic voices take time to load.
  // keep checking until voices come
  new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.speechSynthesis.getVoices().length !== 0) {
        synth = new Synth();
        resolve(synth.getVoices());
        clearInterval(interval);
      }
    }, 10);
  })
    .then(voices => {
      const voicesSelect = document.getElementById("vor-voices");
      voices.forEach((voice, index) => {
        voicesSelect.add(new Option(voice.name, index));
      });

      voicesSelect.addEventListener("change", () => {
        const voiceIndex = voicesSelect.options[voicesSelect.selectedIndex].value;
        synth.setVoice(synth.getVoices()[voiceIndex]);
      });
    })
    .catch(console.log);
});
