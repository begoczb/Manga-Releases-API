const homepageLinks = require("./kodansha-scrapSeriesPage.seed");
const mangaSeriesInfo = require("./kodansha-scrapMangaSeries.seed");
require("../../db");

const runAll = async () => {
  const allLinks = await homepageLinks();
  await mangaSeriesInfo(allLinks);
};
runAll();
