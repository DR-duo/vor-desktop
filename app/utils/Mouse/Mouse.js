const ioHook = require("iohook");

const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 2;
const MOUSE_MIDDLE_CLICK = 3;

class MouseAdapter {
  constructor() {}

  initialize() {
    ioHook.start(true);
  }

  registerEvent(event, func) {
    ioHook.on(event, func);
  }
}

module.exports = new MouseAdapter();
