const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const MangaVolume = require("../../models/MangaVolume.model.js");
const homepageLinks = require("./kodansha-scrapSeriesPage.seed");
const { dateConversion } = require("../../helper/dateConversion.js");

async function volumeInfo(links, id, viewAll) {
  const volume = {
    series: id,
  };

  for (let i = 0; i < links.length; i++) {
    if (!viewAll) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));

      const response = await fetch(`${links[i]}`);
      const text = await response.text();
      const dom = await new JSDOM(text);

      volume.title = dom.window.document
        .querySelector(`.title`)
        .textContent.trim();
      const tempIsbn = dom.window.document.querySelector(
        `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
      );

      if (!tempIsbn) {
        volume.ISBN = dom.window.document.querySelector(
          `div.l-sidebar--baseline:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
        ).textContent;
      } else {
        volume.ISBN = tempIsbn.textContent;
      }

      volume.number = i + 1;

      volume.releaseDate = dom.window.document.querySelector(
        `[role="definition"] > .tag`
      ).textContent;

      let { releaseDate } = volume;
      // console.log(`date we get: ${releaseDate}`);

      if (releaseDate.includes("in")) {
        // console.log(`We have invalid date: ${releaseDate}`);
        releaseDate = dom.window.document.querySelector(
          `.product-info-box__release-info > div:nth-child(2) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1)`
        ).textContent;
      }

      volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");
      volume.cover = dom.window.document.querySelector(`.attachment-large`).src;

      const { title } = volume;
      const upsertedMangaVolume = await MangaVolume.findOneAndUpdate(
        { title: title },
        volume,
        { upsert: true, new: true }
      );

      // console.log(upsertedMangaVolume);

      await timer(200);
    } else {
      const volumeLinks = await homepageLinks(links[i], true);

      for (let j = 0; j < volumeLinks.length; j++) {
        const timer = (ms) => new Promise((res) => setTimeout(res, ms));
        const response = await fetch(`${volumeLinks[j]}`);

        const text = await response.text();
        const dom = await new JSDOM(text);
        volume.title = dom.window.document
          .querySelector(`.title`)
          .textContent.trim();
        let tempIsbn = dom.window.document.querySelector(
          `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
        );
        if (tempIsbn) {
          volume.ISBN = tempIsbn.textContent;
        } else {
          volume.ISBN = "BUG";
        }

        volume.number = j + 1;
        volume.releaseDate = dom.window.document.querySelector(
          `[role="definition"] > .tag`
        ).textContent;
        let { releaseDate } = volume;
        // console.log(`date we get: ${releaseDate}`);

        if (releaseDate.includes("in")) {
          // console.log(`We have invalid date: ${releaseDate}`);
          releaseDate = dom.window.document.querySelector(
            `.product-info-box__release-info > div:nth-child(2) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1)`
          ).textContent;
        }

        volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");

        volume.cover =
          dom.window.document.querySelector(`.product-image > img`).src;

        const { title } = volume;
        const upsertedMangaVolume = await MangaVolume.findOneAndUpdate(
          { title: title },
          volume,
          { upsert: true, new: true }
        );

        // console.log(upsertedMangaVolume);
        await timer(300);
      }
    }
  }
  return;
}

module.exports = volumeInfo;
