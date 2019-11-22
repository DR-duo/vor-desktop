const ioHook = require("iohook");
const activeWin = require("active-win");

const MOUSE_LEFT_CLICK = 1;
//const MOUSE_RIGHT_CLICK = 2;
const MOUSE_MIDDLE_CLICK = 3;

const MOUSE_ACTION_DOUBLE = "double click";
const MOUSE_ACTION_MIDDLE = "middle click";
const DEFAULT_INTERVAL_TIME = 1000;
const LOR_GAME_TITLE = "Legends of Runeterra";

/**
 *  Class for all mouse related events
 *  Adds "double click" and "middle click" custom events on top of iohook module
 */
class MouseAdapter {
  constructor() {
    this.logs = [];
    this.interval = null;
  }

  initialize() {
    ioHook.start(true);
  }

  registerEvent(event, func) {
    ioHook.on(event, func);
  }

  unregisterEvent(event, func) {
    ioHook.off(event, func);
  }

  // logging on works if clicks are in game
  async logEvent(event) {
    const { title } = await activeWin();
    if (title === LOR_GAME_TITLE) this.logs.push(event);
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.evaluateEvents();
    }, DEFAULT_INTERVAL_TIME);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  // check for double click and middle click
  evaluateEvents() {
    let lastClick = null;

    this.logs.forEach(event => {
      switch (event.button) {
        case MOUSE_LEFT_CLICK:
          if (lastClick && lastClick.button === MOUSE_LEFT_CLICK) {
            dispatchEvent(new CustomEvent(MOUSE_ACTION_DOUBLE, { detail: event }));
          }
          break;
        case MOUSE_MIDDLE_CLICK:
          dispatchEvent(new CustomEvent(MOUSE_ACTION_MIDDLE, { detail: event }));
          break;
        default:
          return;
      }
      lastClick = event;
    });

    // clear the logs for next interval
    this.logs = [];
  }
}

module.exports = { MOUSE_ACTION_DOUBLE, MOUSE_ACTION_MIDDLE, mouse: new MouseAdapter() };
