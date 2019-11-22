const { remote } = require("electron");

// Setup configuration windows
window.addEventListener("DOMContentLoaded", () => {
  const close = document.getElementById("vor-help-close");

  close.addEventListener("click", () => {
    remote.getCurrentWindow().close();
  });
});
