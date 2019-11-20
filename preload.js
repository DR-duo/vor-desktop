// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const runeterra = require("./app/utils/Runeterra/Runeterra");
const mouse = require("./app/utils/Mouse/Mouse");
const sound = require("./app/utils/Sound/Sound");

let lastCardClick = null;

async function eventClick(event) {
  const { x, y, button } = event;
  const card = await runeterra.getCardAtCoord(x, y);
  console.log(lastCardClick, card);
  if (lastCardClick) {
    const { CardID: id } = card;
    const { CardID: lastId } = lastCardClick;

    if (id === lastId) {
      sound.playSound();
    }

    lastCardClick = null;
  } else {
    lastCardClick = card || null;
  }
}

mouse.initialize();
mouse.registerEvent("mouseclick", eventClick);

console.log("Try move your mouse or press any key");
