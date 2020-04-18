const { Router } = require('express');
const puppeteer = require("puppeteer");

const router = Router();

router.get('/mine', function (req, res, next) {
  req.setTimeout(500000);
  let url = req.query.query;
  console.log(url);
  let final_object = {};

  (async () => {
    try {
      let browser = await puppeteer.launch({headless: false});
      let page = await browser.newPage();
      await page.setViewport({width: 1920, height: 1080});
      await page.goto(url, {waitUntil: 'load', timeout: 0});
      await browser.close();
    } catch (e) {
      console.error(e);
    } finally {
      await res.json(final_object);
    }
  })();
});

module.exports = router;
