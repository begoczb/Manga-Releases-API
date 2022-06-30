const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Seven Seas Entertainment series page 
async function allSeriesLinks() {
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      await timer(10000);
  const response = await fetch("https://sevenseasentertainment.com/series/");
    console.log(response);
  const text = await response.text();
  const dom = await new JSDOM(text);
  let allSeriesLinks = dom.window.document.querySelectorAll("#series > a");
    console.log(allSeriesLinks);

  allSeriesLinks.forEach((element) => {
        console.log(element.href)
        
    })
  return allSeriesLinks;
}

module.exports = allSeriesLinks