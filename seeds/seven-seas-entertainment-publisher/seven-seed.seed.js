const allSeriesLinks = require("./seven-scrapSeriesPage.seed.js");
const mangaSeriesInfo = require("./seven-scrapMangaSeries.seed.js");
const { default: mongoose } = require("mongoose");
require("../../db");

const runAll = async () => {
  const allLinks = await allSeriesLinks();
  await mangaSeriesInfo(allLinks);
  // console.log(mangaSeriesInfo)
  // console.log(allLinks)
  await mongoose.connection.close()
};
runAll();
