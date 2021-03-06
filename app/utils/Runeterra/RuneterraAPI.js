const axios = require("axios");

/**
 *  Class for using RuneterraAPI
 */

class RuneterraAPI {
  constructor(url = "localhost", port = 21337) {
    this.url = `http://${url}:${port}`;
  }

  /* Basic one to one with API */
  async endpointPositionalRectangles() {
    const endpoint = `${this.url}/positional-rectangles`;
    const response = await axios.get(endpoint).catch(console.log);
    const { data } = response;

    return data;
  }
}

module.exports = (url, port) => new RuneterraAPI(url, port);
