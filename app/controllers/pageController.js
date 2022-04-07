const podkapotScraper = require('../managers/podkapotScraper');

async function scrapeAll(browserInstance){
  let browser;
  try{
    browser = await browserInstance;
    await podkapotScraper.scraper(browser);
    await browser.close();
  }
  catch(err){
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
