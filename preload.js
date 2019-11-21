// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const runeterra = require("./app/utils/Runeterra/Runeterra");
const { MOUSE_ACTION_DOUBLE, MOUSE_ACTION_MIDDLE, mouse } = require("./app/utils/Mouse/Mouse");
const Synth = require("./app/utils/Sound/BrowserSynth");
const { langs } = require("./config.js");
const helpWindow = require("./app/HelpWindow");

let isActive = false;
let synth;

// functions for mouse events
async function handleDoubleClick(event) {
  const { x, y } = event.detail;
  const card = await runeterra.getCardAtCoord(x, y);

  if (card) {
    synth.say(card.name);
  }
}

function handleMiddleClick() {
  synth.say("middle click");
}

function handleMouseClick(event) {
  mouse.logEvent(event);
}

// Initial mouse events create custom mouse events
mouse.initialize();
window.addEventListener(MOUSE_ACTION_DOUBLE, handleDoubleClick);
window.addEventListener(MOUSE_ACTION_MIDDLE, handleMiddleClick);

// Setup configuration windows
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("vor-button");
  const select = document.getElementById("vor-language");
  const volume = document.getElementById("vor-volume");
  const test = document.getElementById("vor-test");
  const help = document.getElementById("vor-help");

  button.innerText = "Inactive";
  Object.entries(langs).forEach(lang => {
    select.add(new Option(lang[1], lang[0]));
  });

  button.addEventListener("click", () => {
    isActive = !isActive;
    button.innerText = isActive ? "Active" : "Inactive";

    // manage events
    if (isActive) {
      mouse.registerEvent("mouseclick", handleMouseClick);
      mouse.startInterval();
    } else {
      mouse.unregisterEvent("mouseclick", handleMouseClick);
      mouse.stopInterval();
    }
    button.classList.toggle("btn-on");
    button.classList.toggle("btn-off");
  });
  select.addEventListener("change", () => {
    const language = select.options[select.selectedIndex].value;
    runeterra.setLanguage(language);
  });
  volume.addEventListener("change", () => {
    const vol = volume.value / 100;
    synth.setVolume(vol);
  });
  test.addEventListener("click", () => {
    synth.say("Legends of Runeterra");
  });
  help.addEventListener("click", () => {
    helpWindow();
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
  }).then(voices => {
    // Populating choices
    const voicesSelect = document.getElementById("vor-voices");
    voices.forEach((voice, index) => {
      voicesSelect.add(new Option(voice.name, index));
    });

    // Change selected voice index when changed
    voicesSelect.addEventListener("change", () => {
      const voiceIndex = voicesSelect.options[voicesSelect.selectedIndex].value;
      synth.setVoice(synth.getVoices()[voiceIndex]);
    });
  });
});
