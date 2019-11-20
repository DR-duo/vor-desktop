const ioHook = require("iohook");
const activeWin = require("active-win");
const runeterra = require("./app/utils/Runeterra/Runeterra");
const mouse = require("./app/utils/Mouse/Mouse");
const sound = require("./app/utils/Sound/Sound");

function eventHandler(event) {
  console.log(event);
}

const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 2;
const MOUSE_MIDDLE_CLICK = 3;

async function eventClick(event) {
  const { x, y, button } = event;
  const card = await runeterra.getCardAtCoord(x, y);
  console.log(x, y, button);
  console.log(card);
  if (card) {
    sound.playSound();
  }

  /*   (async () => {
    console.log(await activeWin());
  })(); */

  /* 
  let audio = new Audio("sound.mp3");
  audio.play(); */
}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  mouse.initialize();
  mouse.registerEvent("mouseclick", eventClick);

  console.log("Try move your mouse or press any key");
});
