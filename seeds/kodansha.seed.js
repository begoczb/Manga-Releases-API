const { response } = require("express");
const fetch = require("isomorphic-fetch");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dateConversion = require("../helper/dateConversion.js");
const insertString = require("../helper/insertString.js");

const baseURL = "https://kodansha.us/manga/browse-series";

async function homepageLinks(url) {
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
    const allPagination =
      dom.window.document.querySelectorAll(`.pagination__page`);

    if (allPagination.length > 1) {
      const pagesTotal = allPagination[allPagination.length - 1].textContent;
      for (let i = 2; i <= pagesTotal; i++) {
        const timer = (ms) => new Promise((res) => setTimeout(res, ms));
        url = insertString(url, `/page/${i}`, 40);
        console.log(url);
        const res = await fetch(`${url}`);
        const text = await res.text();
        const dom = await new JSDOM(text);
        const allHref = dom.window.document.querySelectorAll(`.card__link`);
        allHref.forEach((element) => allLinks.push(element.href));
        console.log(allLinks);
        console.log(`page: ${i}`);
        await timer(200);
      }
    }
  }

  return allLinks;
}

(async function mangaSeriesInfo() {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  const allLinks = await homepageLinks();

  const series = {};

  for (let i = 0; i < allLinks.length; i++) {
    let scrappedLinks = [];
    let leftover = [];
    let link = allLinks[i];
    let firstSelector;

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

        let leftoverLink = firstSelector.querySelectorAll(`.card__link`);

        Array.from(leftoverLink).forEach((element) =>
          leftover.push(element.href)
        );
      }
    }

    console.log(series);
    await volumeInfo(scrappedLinks, series._id, true);
    await volumeInfo(leftover, series._id, false);
    await timer(200);
  }

  return;
});

async function volumeInfo(links, id, viewAll) {
  // console.log(nextLinks);
  const volume = {};

  for (let i = 0; i < links.length; i++) {
    if (!viewAll) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const response = await fetch(`${links[i]}`);
      // console.log(links);

      const text = await response.text();
      const dom = await new JSDOM(text);
      // volume.series = id;
      volume.title = dom.window.document
        .querySelector(`.title`)
        .textContent.trim();
      const tempIsbn = dom.window.document.querySelector(
        `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
      );

      if (!tempIsbn) {
        volume.isbn = dom.window.document.querySelector(
          `div.l-sidebar--baseline:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
        ).textContent;
      } else {
        volume.isbn = tempIsbn.textContent;
      }

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
      const volumeLinks = await homepageLinks(links[i], true);
      console.log(volumeLinks);
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
          volume.isbn = tempIsbn.textContent;
        } else {
          volume.isbn = "BUG";
        }

        volume.number = j + 1;
        volume.releaseDate = dom.window.document.querySelector(
          `[role="definition"] > .tag`
        ).textContent;
        let { releaseDate } = volume;

        volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");

        volume.cover =
          dom.window.document.querySelector(`.product-image > img`).src;

        console.log(volume);

        await timer(300);
      }
    }
  }
  return;
}

// async function volumeInfoTest(link) {
//   const volume = {};

//   const timer = (ms) => new Promise((res) => setTimeout(res, ms));
//   const response = await fetch(`${links[i]}`);
//   console.log(links);

//   const text = await response.text();
//   const dom = await new JSDOM(text);
//   // volume.series = id;
//   volume.title = dom.window.document.querySelector(`.title`).textContent.trim();
//   const tempIsbn = dom.window.document.querySelector(
//     `.product-info-box__release-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
//   );

//   if (!tempIsbn) {
//     volume.isbn = dom.window.document.querySelector(
//       `div.l-sidebar--baseline:nth-child(2) > span:nth-child(2) > span:nth-child(1)`
//     ).textContent;
//   } else {
//     volume.isbn = tempIsbn.textContent;
//   }

//   volume.number = i + 1;
//   volume.releaseDate = dom.window.document.querySelector(
//     `[role="definition"] > .tag`
//   ).textContent;
//   let { releaseDate } = volume;

//   volume.releaseDate = dateConversion(releaseDate, "MMDDYYYY");
//   volume.cover = dom.window.document.querySelector(`.attachment-large`).src;
//   console.log(volume);

//   await timer(200);

//   return;
// }

// volumeInfoTest(link);
