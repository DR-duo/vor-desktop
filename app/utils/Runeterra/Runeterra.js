const api = require("./RuneterraAPI")();

class RuneterraAdapter {
  /**
   * Returns card at specified x,y coordinate.
   * x, y have origin from top left
   */
  getCardAtCoord = async (x, y) => {
    const {
      Rectangles: cards,
      Screen: screenSize
    } = await api.endpointPositionalRectangles();
    const gameX = x;
    const gameY = screenSize.ScreenHeight - y;

    const card = cards.find(({ TopLeftX, TopLeftY, Height, Width }) => {
      const left = TopLeftX;
      const right = TopLeftX + Width;
      const top = TopLeftY;
      const bottom = TopLeftY - Height;

      if (gameX >= left && gameX <= right && gameY <= top && gameY >= bottom) {
        return true;
      }
    });

    return card;
  };
}

module.exports = new RuneterraAdapter();
