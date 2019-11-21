const api = require("./RuneterraAPI")();
const config = require("../../../config.js");

const cardData = Object.keys(config.langs).reduce((langKeys, lang) => {
  const myPath = `../../../app/assets/card_data/set1-${lang}.json`;
  const data = require(myPath).reduce((cards, card) => {
    cards[card.cardCode] = card;
    return cards;
  }, {});

  langKeys[lang] = data;
  return langKeys;
}, {});

class RuneterraAdapter {
  constructor() {
    this.lang = Object.keys(config.langs)[0];
  }

  setLanguage(lang) {
    this.lang = lang;
  }

  /**
   * Returns card at specified x,y coordinate.
   * x, y have origin from top left
   */
  async getCardAtCoord(x, y) {
    const { Rectangles, Screen: screenSize } = await api.endpointPositionalRectangles();
    const gameX = x;
    const gameY = screenSize.ScreenHeight - y;

    const card = Rectangles.filter(card => card.CardCode !== "face").find(
      ({ TopLeftX, TopLeftY, Height, Width }) => {
        const left = TopLeftX;
        const right = TopLeftX + Width;
        const topEdge = TopLeftY;
        const bottom = TopLeftY - Height;
        /*         console.log(`x:${x} y:${y}
        gameX:${gameX} gameY:${gameY}
        CardCode: ${CardCode}
        left:${left} right:${right} top:${top} bottom: ${bottom}`); */

        return gameX >= left && gameX <= right && gameY <= topEdge && gameY >= bottom;
      }
    );

    return card ? cardData[this.lang][card.CardCode] : null;
  }
}

module.exports = new RuneterraAdapter();
