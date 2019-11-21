class BrowserSynth {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentVoice = this.synth.getVoices()[0];
  }

  getVoices() {
    return this.synth.getVoices();
  }

  setVoice(voice) {
    this.currentVoice = voice;
  }

  say(text) {
    return new Promise((resolve, reject) => {
      const phrase = new SpeechSynthesisUtterance(text);
      phrase.voice = this.currentVoice;
      phrase.addEventListener("end", resolve);
      phrase.addEventListener("error", reject);
      this.synth.speak(phrase);
    });
  }
}

module.exports = BrowserSynth;
