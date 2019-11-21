class BrowserSynth {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentVoice = this.synth.getVoices()[0];
    this.volume = 1;
  }

  getVoices() {
    return this.synth.getVoices();
  }

  setVoice(voice) {
    this.currentVoice = voice;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  say(text) {
    return new Promise((resolve, reject) => {
      const phrase = new SpeechSynthesisUtterance(text);
      phrase.voice = this.currentVoice;
      phrase.volume = this.volume;
      phrase.addEventListener("end", resolve);
      phrase.addEventListener("error", reject);
      this.synth.speak(phrase);
    });
  }
}

module.exports = BrowserSynth;
