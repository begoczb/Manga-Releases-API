const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { dateConversion } = require("../../helper/dateConversion.js");
// const { getDate } = require("../../helper/dateConversion.js");
const { JSDOM } = jsdom;
const MangaVolume = require("../../models/MangaVolume.model.js");

function getIsbnFromBoldTags(boldTags) {
  const isbnLabelRegex = new RegExp("ISBN", "i");
  const isbnRegex = new RegExp(
    "(\\d{3}-\\d-\\d{6}-\\d{2}-\\d|Ebook Only|\\d{3}-\\d-\\d{5}-\\d{3}-\\d|\\d{3}-\\d-\\d{4}-\\d{4}-\\d|\\d{3}-\\d-\\d{6}-\\d-\\d{2}|\\d{3}-\\d-\\d{6}-\\d-\\d{2}|\\d{3}-\\d-\\d{8}-\\d|(digital-only single)|(digital-only)|\\d{13}|\\d{3}-\\d-\\d{7}-\\d{2}| \\d{3}-\\d-\\d{9}|\\d{3}-\\d-\\d{9}|\\d{3}-\\d-\\d{6}|\\d{2}-\\d)"
  );

  return getPropertyFromBoldTags(boldTags, isbnLabelRegex, isbnRegex);
}

function getReleaseDateFromBoldTags(boldTags) {
  const labelRegex = new RegExp("Release\\s+Date", "i");
  const valueRegex = new RegExp("\\d{4}/\\d{2}/\\d{2}");

  const releaseDateFromHtml = getPropertyFromBoldTags(
    boldTags,
    labelRegex,
    valueRegex
  );
  const date = dateConversion(releaseDateFromHtml, "YYYYMMDD");
  return date;
}

function getPropertyFromBoldTags(boldTags, labelRegex, valueRegex) {
  let value = null;

  for (let i = 0; i < boldTags.length; i++) {
    const label = boldTags[i].textContent;
    if (labelRegex.test(label)) {
      value = boldTags[i].nextSibling.textContent.trim();
      if (!valueRegex.test(value)) {
        // console.log(value);
        throw new Error(`Unknown value: ${value}`);
      }
      continue;
    }
  }
  return value;
}

async function mangasVolumesLinks(link, id) {
  const response = await fetch(`${link}`);
  const text = await response.text();
  const dom = await new JSDOM(text);
  const mangasVolumes =
    dom.window.document.querySelectorAll(".series-volume > a");
  const allVolumesLinks = Array.from(mangasVolumes).map(
    (element) => element.href
  );
  for (let i = 0; i < allVolumesLinks.length; i++) {
    const volumeLink = allVolumesLinks[i];
    scrapeMangaVolume(volumeLink, i, id);
  }
  return;
}

async function scrapeMangaVolume(volumeLink, i = 0, id) {
  const response = await fetch(`${volumeLink}`);
  const text = await response.text();
  const dom = await new JSDOM(text);
  const volumeTitle = dom.window.document
    .querySelector(".topper")
    .textContent.slice(6);
  const detailsParagraph = dom.window.document.querySelector(
    "#volume-meta > p:not(.bookcrew)"
  );

  const boldTags = detailsParagraph.querySelectorAll("b");
  const releaseDate = getReleaseDateFromBoldTags(boldTags);
  const ISBN = getIsbnFromBoldTags(boldTags);
  let isbnValue;
  if (
    !["Ebook Only", "(digital-only)", "(digital-only single)"].includes(ISBN)
  ) {
    isbnValue = ISBN.split("-").join("");
  }

  const volumesImg = dom.window.document.querySelector("#volume-cover img").src;
  const number = i + 1;
  const mangaVolume = {
    series: id,
    title: volumeTitle,
    ISBN: isbnValue,
    number,
    releaseDate,
    cover: volumesImg,
  };

  const upsertedMangaVolume = await MangaVolume.findOneAndUpdate(
    { title: volumeTitle },
    mangaVolume,
    { upsert: true, new: true }
  );

  // console.log(upsertedMangaVolume);
}

module.exports = mangasVolumesLinks;
