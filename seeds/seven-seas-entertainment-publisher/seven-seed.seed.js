const allSeriesLinks = require("./seven-scrapSeriesPage.seed.js");
const mangaSeriesInfo = require("./seven-scrapMangaSeries.seed.js");
require("../../db");

const runAll = async () => {
  const allLinks = await allSeriesLinks();
  await mangaSeriesInfo(allLinks);
};
runAll();
