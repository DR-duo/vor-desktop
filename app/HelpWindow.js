const { remote, BrowserWindow } = require("electron");
const path = require("path");

const createHelpWindow = () => {
  let win;
  const isRenderer = process && process.type === "renderer";
  const windowConfig = {
    show: false,
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "help.js"),
    },
  };

  // create browser window based on process
  win = isRenderer ? new remote.BrowserWindow(windowConfig) : new BrowserWindow(windowConfig);

  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("closed", () => {
    win = null;
  });
  win.loadFile("app/help.html");
};

module.exports = () => createHelpWindow();
