const ioHook = require("iohook");
function eventHandler(event) {
  console.log(event);
}

function eventClick(event) {
  console.log(event);
  let audio = new Audio("sound.mp3");
  audio.play();
}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  ioHook.start(true);
  ioHook.on("mouseclick", eventClick);
  ioHook.on("keypress", eventHandler);
  ioHook.on("mousewheel", eventHandler);
  ioHook.on("mousemove", eventHandler);
  console.log("Try move your mouse or press any key");
});
