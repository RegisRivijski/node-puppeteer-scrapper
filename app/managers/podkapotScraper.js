const config = require('config');
const fs = require('fs');
const delayHelper = require('../helpers/delay');

const scraperObject = {
  url: `${config.website.podkapot.schema}//${config.website.podkapot.hostname}`,
  async scraper(browser){
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url, {
      timeout: 0,
    });

    let range = [];
    const pagesToParse = 60;
    for (let i = 0; i < pagesToParse; i += 1) range.push(i);

    const parsedData = [];
    for await (const number of range) {
      const phoneButtons = await page.$$('span > a.helper-site-firm-phone');
      for await (const el of phoneButtons) {
        await el.click()
          .catch((e) => console.error(e));
        await delayHelper.delay(500);
      }

      const content = await page.$$('div.firms-box__list-sheet__row > div.firms-box__list-sheet__row__cell');
      for await (const target of content) {
        const iHtml = await page.evaluate(el => el.innerText, target);
        parsedData.push(iHtml)
      }

      const moreButton = await page.$$('div > .load-more-firms');
      for await (const el of moreButton) {
        await el.click()
          .catch((e) => console.error(e));
      }
      await delayHelper.delay(60000);
    }

    const objects = [];
    for (let i = 0; i < parsedData.length; i += 3) {
      const tmpObject = {
        name: parsedData[i].trim(),
        city: parsedData[i + 1].trim(),
        phones: parsedData[i + 2].trim(),
      };
      objects.push(tmpObject);
    }

    fs.writeFileSync('./data/podkapot.json', JSON.stringify(objects, null, 2));
  }
}

module.exports = scraperObject;
