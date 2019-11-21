const api = require("./RuneterraAPI")();

class RuneterraAdapter {
  /**
   * Returns card at specified x,y coordinate.
   * x, y have origin from top left
   */
  async getCardAtCoord(x, y) {
    const {
      Rectangles,
      Screen: screenSize
    } = await api.endpointPositionalRectangles();
    const gameX = x;
    const gameY = screenSize.ScreenHeight - y;

    const cards = [...Rectangles];
    const card = cards
      .reduce((accum, card) => {
        if (card.CardCode === "face") {
          return [...accum];
        } else {
          return [...accum, card];
        }
      }, [])
      .find(({ TopLeftX, TopLeftY, Height, Width }) => {
        const left = TopLeftX;
        const right = TopLeftX + Width;
        const top = TopLeftY;
        const bottom = TopLeftY - Height;
        /*         console.log(`x:${x} y:${y}
        gameX:${gameX} gameY:${gameY}
        CardCode: ${CardCode}
        left:${left} right:${right} top:${top} bottom: ${bottom}`); */

        if (
          gameX >= left &&
          gameX <= right &&
          gameY <= top &&
          gameY >= bottom
        ) {
          return true;
        }
      });

    return card;
  }
}

module.exports = new RuneterraAdapter();
