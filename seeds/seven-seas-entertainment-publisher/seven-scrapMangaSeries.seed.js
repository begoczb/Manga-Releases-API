const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const MangaSeries = require("../../models/MangaSeries.model.js");
const mangasVolumesLinks = require("./seven- scrapMangaVolume.seed");

async function mangaSeriesInfo(allLinks) {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  for (let i = 0; i < allLinks.length; i++) {
    let link = allLinks[i];
    const response = await fetch(`${link}`);
    const text = await response.text();
    const dom = await new JSDOM(text);

    const mangaSeriesName = dom.window.document
      .querySelector(".topper")
      .textContent.slice(8);
    const mangaSeriesAuthors = dom.window.document.querySelectorAll(
      '#series-meta a:not([rel="tag"])'
    );
    const authors = Array.from(mangaSeriesAuthors).map(
      (element) => element.textContent
    );
    const mangaSeriesGenres = dom.window.document.querySelectorAll(
      '#series-meta [rel="tag"]'
    );
    const genres = Array.from(mangaSeriesGenres).map(
      (element) => element.textContent
    );
    const mangaSeriesSynopsis =
      dom.window.document.querySelector(".entry").textContent;

    const mangaSeries = {
      name: mangaSeriesName,
      authors,
      genres,
      synopsis: mangaSeriesSynopsis,
      publisher: "Seven Seas Entertainment",
      lang: "en",
    };

    const upsertedMangaSeries = await MangaSeries.findOneAndUpdate(
      { name: mangaSeriesName },
      mangaSeries,
      { upsert: true, new: true }
    );
    console.log(upsertedMangaSeries);

    const allMangaVolumesLinks = await mangasVolumesLinks(
      link,
      upsertedMangaSeries._id
    );
    await timer(200);
    // console.log(allMangaVolumesLinks);
  }
}

module.exports = mangaSeriesInfo;
