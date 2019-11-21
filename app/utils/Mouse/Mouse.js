const ioHook = require("iohook");

const MOUSE_LEFT_CLICK = 1;
//const MOUSE_RIGHT_CLICK = 2;
const MOUSE_MIDDLE_CLICK = 3;

const MOUSE_ACTION_DOUBLE = "double click";
const MOUSE_ACTION_MIDDLE = "middle click";

class MouseAdapter {
  constructor() {
    this.logs = [];
    this.interval = null;
    this.events = {};
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

  registerCustomEvent(key, obj) {
    this.events[key] = obj;
  }

  unregisterCustomEvent(key) {
    delete this.events[key];
  }

  logEvent(event) {
    this.logs.push(event);
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.evaluateEvents();
    }, 1000);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  // check for double click and middle click
  evaluateEvents() {
    this.actions = new Set();
    let lastClick = null;

    this.logs.forEach(event => {
      switch (event.button) {
        case MOUSE_LEFT_CLICK:
          if (lastClick && lastClick.button === MOUSE_LEFT_CLICK) {
            console.log("doule click baby");
            dispatchEvent(new CustomEvent(MOUSE_ACTION_DOUBLE, { detail: event }));
          }
          break;
        case MOUSE_MIDDLE_CLICK:
          //dispatchEvent(this.events[MOUSE_ACTION_MIDDLE]);
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

module.exports = {
  mouse: new MouseAdapter(),
};
