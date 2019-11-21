const { remote } = require("electron");
const path = require("path");

const createHelpWindow = () => {
  console.log("create");
  let win = new remote.BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "help.js"),
    },
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("closed", () => {
    win = null;
  });
  win.webContents.openDevTools();

  win.loadFile("app/help.html");
};

module.exports = () => createHelpWindow();
