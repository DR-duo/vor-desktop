const ioHook = require("iohook");

class MouseAdapter {
  constructor() {}
  initialize() {
    console.log("few");
    ioHook.start(true);
  }

  registerEvent(event, func) {
    console.log("fwe");
    ioHook.on(event, func);
  }
}

module.exports = new MouseAdapter();
