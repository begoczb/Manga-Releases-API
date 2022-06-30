const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const MangaSeries = require("../../models/MangaSeries.model.js");
const volumeInfo = require("./kodansha-scrapMangaVolume.seed");

async function mangaSeriesInfo(allLinks) {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  const series = {};

  for (let i = 0; i < allLinks.length; i++) {
    let scrappedLinks = [];
    let leftover = [];
    let link = allLinks[i];
    let firstSelector;

    const response = await fetch(`${link}`);

    const text = await response.text();
    const dom = await new JSDOM(text);

    series.name = dom.window.document
      .querySelector(`h1.title`)
      .textContent.trim();
    const mangaAuthors = dom.window.document.querySelectorAll(`.byline`);
    series.authors = Array.from(mangaAuthors).map((element) =>
      element.textContent.replace("By ", "")
    );
    series.synopsis = dom.window.document.querySelector(
      `.product-detail-hero__synopsis > p`
    ).textContent;
    const mangaSeriesGenres =
      dom.window.document.querySelectorAll(`.tag-list span.tag`);
    series.genres = Array.from(mangaSeriesGenres).map(
      (element) => element.textContent
    );
    series.publisher = "KODANSHA";
    series.lang = "en";

    const singleLink = dom.window.document.querySelector(`.cta--with-arrow`);

    if (singleLink && singleLink.textContent.includes("Volumes")) {
      scrappedLinks.push(singleLink.href);
      // console.log(`We have singlelink`);
    } else {
      let tempLink = dom.window.document.querySelector(
        `[aria-label="View All: Volumes"`
      );
      if (tempLink) {
        scrappedLinks.push(tempLink.href);
      } else {
        // console.log(`we don't have singleLink`);
        firstSelector = dom.window.document.querySelector(".product-discovery");
        if (!firstSelector) {
          continue;
        }

        let leftoverLink = firstSelector.querySelectorAll(`.card__link`);

        Array.from(leftoverLink).forEach((element) =>
          leftover.push(element.href)
        );
      }
    }

    // console.log(series);
    const { name } = series;
    const upsertedMangaSeries = await MangaSeries.findOneAndUpdate(
      { name: name },
      series,
      { upsert: true, new: true }
    );
    console.log(upsertedMangaSeries);

    await volumeInfo(scrappedLinks, upsertedMangaSeries._id, true);
    await volumeInfo(leftover, upsertedMangaSeries._id, false);
    await timer(200);
  }

  return;
}

module.exports = mangaSeriesInfo;
