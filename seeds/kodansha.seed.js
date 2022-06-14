const { response } = require("express");
const fetch = require("isomorphic-fetch");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dateConversion = require("../helper/dateConversion.js");

const baseURL = "https://kodansha.us/manga/browse-series";

async function allHref(url, selector) {
  let allLinks = [];
  if (!url) {
    const response = await fetch(`${baseURL}`);
    const text = await response.text();
    const dom = await new JSDOM(text);
    const allPagination =
      dom.window.document.querySelectorAll(`.pagination__page`);
    const pagesTotal = allPagination[allPagination.length - 1].textContent;

    for (let i = 1; i <= pagesTotal; i++) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const res = await fetch(`${baseURL}/page/${i}/`);
      const text = await res.text();
      const dom = await new JSDOM(text);
      const allHref = dom.window.document.querySelectorAll(`.card__link`);
      allHref.forEach((element) => allLinks.push(element.href));
      await timer(200);
    }
  } else {
    const res = await fetch(`${url}`);
    const text = await res.text();
    const dom = await new JSDOM(text);
    const allHref = dom.window.document.querySelectorAll(`.card__link`);
    allHref.forEach((element) => allLinks.push(element.href));
  }

  return allLinks;
}

(async function seeAllVolumes() {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  const allLinks = await allHref();

  const series = {};

  for (let i = 0; i < allLinks.length; i++) {
    let scrappedLinks = [];
    let leftover = [];
    let link = allLinks[i];

    const response = await fetch(`${link}`);

    const text = await response.text();
    const dom = await new JSDOM(text);
    // const singleLink = dom.window.document.querySelector(
    //   `[aria-label="View All: Volumes"`
    // );
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

    const singleLink = dom.window.document.querySelector(`.cta--with-arrow`);

    if (singleLink) {
      scrappedLinks.push(singleLink.href);
    } else {
      leftoverLink =
        dom.window.document.querySelectorAll(`h3.title .card__link`);
      Array.from(leftoverLink).forEach((element) =>
        leftover.push(element.href)
      );
    }

    await volumeInfo(scrappedLinks, series._id, true);
    await volumeInfo(leftover, series._id, false);
    await timer(200);
  }

  return;
})();

async function volumeInfo(links, id, viewAll) {
  // console.log(nextLinks);
  const volume = {};

  for (let i = 0; i < links.length; i++) {
    if (!viewAll) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const response = await fetch(`${links[i]}`);

      const text = await response.text();
      const dom = await new JSDOM(text);
      // volume.series = id;
      volume.title = dom.window.document
        .querySelector(`.title`)
        .textContent.trim();
      volume.isbn = dom.window.document.querySelector(
        `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
      ).textContent;

      volume.number = i + 1;
      volume.releaseDate = dom.window.document.querySelector(
        `[role="definition"] > .tag`
      ).textContent;
      let { releaseDate } = volume;

      volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");
      volume.cover = dom.window.document.querySelector(`.attachment-large`).src;
      console.log(volume);

      await timer(200);
    } else {
      const volumeLinks = await allHref(links[i], true);
      for (let j = 0; j < volumeLinks.length; j++) {
        const timer = (ms) => new Promise((res) => setTimeout(res, ms));
        const response = await fetch(`${volumeLinks[j]}`);

        const text = await response.text();
        const dom = await new JSDOM(text);
        volume.title = dom.window.document
          .querySelector(`.title`)
          .textContent.trim();
        volume.isbn = dom.window.document.querySelector(
          `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
        ).textContent;
        volume.number = j + 1;
        volume.releaseDate = dom.window.document.querySelector(
          `[role="definition"] > .tag`
        ).textContent;
        let { releaseDate } = volume;

        volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");

        volume.cover =
          dom.window.document.querySelector(`.attachment-large`).src;

        console.log(volume);

        await timer(200);
      }
    }
  }
  return;
}
