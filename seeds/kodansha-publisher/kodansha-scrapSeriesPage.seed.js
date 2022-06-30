const fetch = require("isomorphic-fetch");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const insertString = require("../../helper/insertString.js");

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

    for (let i = 5; i <= pagesTotal; i++) {
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
        // console.log(url);
        const res = await fetch(`${url}`);
        const text = await res.text();
        const dom = await new JSDOM(text);
        const allHref = dom.window.document.querySelectorAll(`.card__link`);
        allHref.forEach((element) => allLinks.push(element.href));
        // console.log(allLinks);
        // console.log(`page: ${i}`);
        await timer(200);
      }
    }
  }

  return allLinks;
}

module.exports = homepageLinks;
