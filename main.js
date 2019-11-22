"use strict";
// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require("electron");
const helpWindow = require("./app/HelpWindow");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let top = {};

// flag to close
let forceClose = false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "app/assets/img/vor-logo-24x24.png"),
  });

  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    top.win.removeAllListeners("close");
    top = null;
  });

  mainWindow.on("close", event => {
    if (!forceClose) {
      event.preventDefault();
      mainWindow.minimize();
    }
    // Unlike usual browsers that a message box will be prompted to users, returning
    // a non-void value will silently cancel the close.
    // It is recommended to use the dialog API to let the user confirm closing the
    // application.
    return false; // equivalent to `return false` but not recommended
  });

  const tray = new Tray(path.join(__dirname, "app/assets/img/vor-logo-24x24.png"));
  const menu = Menu.buildFromTemplate([
    { label: `Version: ${app.getVersion()}`, enabled: false },
    {
      label: "Open",
      click: () => {
        top.win.show();
      },
    },
    {
      label: "Help",
      click: () => {
        top.help = helpWindow();
      },
    },
    {
      label: "Exit",
      click: () => {
        forceClose = true;
        top.win.close();
      },
    },
  ]);

  tray.setToolTip("Voice of Runeterra");
  tray.setContextMenu(menu);

  top.tray = tray;
  top.win = mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (top.win === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
