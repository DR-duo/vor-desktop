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

        return gameX >= left && gameX <= right && gameY <= topEdge && gameY >= bottom;
      }
    );

    return card ? cardData[this.lang][card.CardCode] : null;
  }

  async getCardState() {
    let { Rectangles, Screen: screenSize } = await api.endpointPositionalRectangles();
    Rectangles = Rectangles.filter(x => x.CardCode !== "face");

    const localCards = Rectangles.filter(x => x.LocalPlayer);
    const localHand = localCards.filter(x => x.Height / screenSize.ScreenHeight > 0.28);
    const opponentCards = Rectangles.filter(x => !x.LocalPlayer);
    const opponentHand = opponentCards.filter(x => x.TopLeftY > screenSize.ScreenHeight);

    const localCardsCount = localCards.length - localHand.length;
    const localHandCount = localHand.length;
    const opponentCardsCount = opponentCards.length - opponentHand.length;
    const opponentHandCount = opponentHand.length;
    return { localCardsCount, localHandCount, opponentCardsCount, opponentHandCount };
  }
}

module.exports = new RuneterraAdapter();
