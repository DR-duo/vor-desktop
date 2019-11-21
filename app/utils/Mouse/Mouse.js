const ioHook = require("iohook");

const MOUSE_LEFT_CLICK = 1;
//const MOUSE_RIGHT_CLICK = 2;
const MOUSE_MIDDLE_CLICK = 3;

const MOUSE_ACTION_DOUBLE = "double click";
const MOUSE_ACTION_MIDDLE = "middle click";

class MouseAdapter {
  constructor() {
    this.events = [];
    this.interval = null;

    this.actions = null;
  }

  initialize() {
    ioHook.start(true);
    ioHook.on("double click", () => {
      console.log("fwef");
    });
  }

  registerEvent(event, func) {
    ioHook.on(event, func);
  }

  unregisterEvent(event, func) {
    ioHook.off(event, func);
  }

  logEvent(event) {
    this.events.push(event);
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.evaluateEvents();
    }, 100);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  // check for double click and middle click
  evaluateEvents() {
    this.actions = new Set();
    let lastClick = null;

    this.events.forEach(event => {
      switch (event.button) {
        case MOUSE_LEFT_CLICK:
          if (lastClick && lastClick.button === MOUSE_LEFT_CLICK) {
            this.actions.add(MOUSE_ACTION_DOUBLE);
          }
          break;
        case MOUSE_MIDDLE_CLICK:
          this.actions.add(MOUSE_ACTION_MIDDLE);
          break;
        default:
          return;
      }
    });

    this.events = [];
  }

  // Returns the list of actions, clear the action queue
  resolveActions() {
    const actions = [...this.actions];
    this.actions = null;
    return actions;
  }
}

module.exports = new MouseAdapter();
