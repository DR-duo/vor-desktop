const sound = {};

sound.playSound = (file = "sound.mp3") => {
  let audio = new Audio(file);
  audio.play();
};

module.exports = sound;
