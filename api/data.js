const { Router } = require('express');
const puppeteer = require("puppeteer");
const striptags = require("striptags");
let psl = require('psl');

const router = Router();

router.get('/mine', function (req, res, next) {
  req.setTimeout(500000);
  let url = req.query.query;
  console.log(url);
  let final_object = {};

  (async () => {
    try {
      let browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
      let page = await browser.newPage();
      await page.setViewport({width: 1920, height: 1080});
      await page.goto(url, {waitUntil: 'load', timeout: 0});

      function extractHostname(url) {
        let hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("//") > -1) {
          hostname = url.split('/')[2];
        }
        else {
          hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
      }

      //NÁZEV
      const headings_1 = await page.evaluate(() => Array.from(document.querySelectorAll("h1"), el => el.innerHTML));
      final_object["name"] = striptags(headings_1[0].trim().replace(/\s\s+/g, ' '));

      //CENA (s DPH)
      let priceHandle = await page.$x("//span[contains(text(), 'DPH')]");
      let otherBranches = false;
      if (priceHandle.length > 0) {
      let price = await page.evaluate(el => el.textContent, priceHandle[0]);
      if (!isNaN(parseFloat(price))) {
        final_object["price"] = parseFloat(price.replace(/\s/g, ''));
      } else {
        otherBranches = true;
      }
      } else {
        otherBranches = true;
      }
      if (otherBranches) {
        let priceHandle_2 = await page.$x("//*[self::b or self::dd][contains(text(), \"Kč\")][not(contains(@class, \"nav\"))]");
        let tryNext = false;
        if (typeof(priceHandle_2) !== undefined) {
            if (priceHandle_2.length > 0) {
              let price_2 = await page.evaluate(el => el.textContent, priceHandle_2[0]);
              if (!isNaN(parseFloat(price_2))) {
                final_object["price"] = parseFloat(price_2.replace(/\s/g, ""));
              }
            } else {
              tryNext = true;
            }
        }
        if (tryNext) {
          let priceHandle_3 = await page.$x("//*[contains(@itemprop, \"price\")]");
          if (priceHandle_3.length > 0) {
            let price_3 = await page.evaluate(el => el.innerHTML, priceHandle_3[0]);
            if (!isNaN(parseFloat(price_3))) {
              final_object["price"] = parseFloat(price_3.replace(/\s/g, "").replace("&nbsp;", ""));
            } else {
              let priceHandle_4 = await page.$x("//*[contains(@id, \"price\") or contains(@class, \"price\")][not(starts-with(text(), \"0\"))][not(contains(text(), \"Doprava\"))][not(contains(@class, \"prices\"))]");
              let price_4 = await page.evaluate(el => el.innerHTML, priceHandle_4[0]);
              if (!isNaN(striptags(price_4.replace("&nbsp;", "").replace(/\D/g, "")))) {
                final_object["price"] = striptags(price_4.replace("&nbsp;", "").replace(/\D/g, ""));
              }
            }
          }
        }
      }

      //POPIS
      const descriptions_1 = await page.evaluate(() => Array.from(document.querySelectorAll("[class*=\"popis\"], [class*=\"description\"], [class*=\"Description\"], [class*=\"annotation\"]"), el => el.innerHTML));
      if (descriptions_1.length > 0 && descriptions_1[0] !== "") {
          final_object["description"] = striptags(descriptions_1[0]).replace(/\s\s+/g, ' ').replace(/&nbsp;/g, '');
      } else {
        let descriptionHandle = await page.$x("//*[not(self::script)][contains(text(), 'Popis produktu')]");
        if (descriptionHandle.length > 0) {
          let description = await page.evaluate(el => el.nextElementSibling.innerHTML, descriptionHandle[0]);
          final_object["description"] = striptags(description).replace(/\s\s+/g, ' ').replace(/&nbsp;/g, '');
        } else {

        }
      }

      //VÝROBCE/ZNAČKA
      let producerHandle = await page.$x("//*[contains(text(), 'Výrobce') or contains(text(), 'Značka')]");
      if (producerHandle.length > 0) {
        let producer = await page.evaluate(el => el.nextElementSibling.textContent, producerHandle[0]);
        final_object["producer"] = producer;
      } else {
        let producerHandle_2 = await page.$x("//*[contains(@class, 'brand')]//img");
        if (producerHandle_2.length > 0) {
          let producer_2 = await page.evaluate(el => el.getAttribute("alt"), producerHandle_2[0]);
          final_object["producer"] = producer_2;
        } else {
          let producerHandle_3 = await page.$x("//*[contains(@itemprop, 'brand')]");
          if (producerHandle_3.length > 0) {
            let producer_3 = await page.evaluate(el => el.innerHTML, producerHandle_3[0]);
            final_object["producer"] = producer_3;
          }
        }
      }

      //OBRÁZEK
      let imgHandle_1 = await page.$x("//img[@data-src][contains(@alt, '"+final_object["name"]+"')]");
      if (imgHandle_1.length > 0) {
          let image_1 = await page.evaluate(el => el.getAttribute("data-src"), imgHandle_1[0]);
          if (image_1.startsWith("http")) {
            final_object["image"] = image_1;
          } else {
            final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_1;
          }
      } else {
          let imgHandle_2 = await page.$x("//img[contains(@alt, '" +final_object["name"]+ "')][@src]");
          if (imgHandle_2.length > 0) {
            let image_2 = await page.evaluate(el => el.getAttribute("src"), imgHandle_2[0]);
            if (image_2.startsWith("http")) {
              final_object["image"] = image_2;
            } else {
              final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_2;
            }
          } else {
            let nameWithoutProducer = final_object["name"].replace(final_object["producer"], "").trim();
            let imgHandle_3 = await page.$x("//img[contains(@alt, '" + nameWithoutProducer + "')][@data-src]");
            if (imgHandle_3.length > 0) {
              let image_3 = await page.evaluate(el => el.getAttribute("data-src"), imgHandle_3[0]);
              if (image_3.startsWith("http")) {
                final_object["image"] = image_3;
              } else {
                final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_3;
              }
            } else {
              let imgHandle_4 = await page.$x("//img[contains(@alt, '" + nameWithoutProducer + "')][@src]");
              if (imgHandle_4.length > 0) {
                let image_4 = await page.evaluate(el => el.getAttribute("src"), imgHandle_4[0]);
                if (image_4.startsWith("http")) {
                  final_object["image"] = image_4;
                } else {
                  final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_4;
                }
              } else {
                let imgHandle_5 = await page.$x("//*[contains(@itemprop, 'image')][@data-src]");
                if (imgHandle_5.length > 0) {
                  let image_5 = await page.evaluate(el => el.getAttribute("data-src"), imgHandle_5[0]);
                  if (image_5.startsWith("http")) {
                    final_object["image"] = image_5;
                  } else {
                    final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_5;
                  }
                } else {
                  let imgHandle_6 = await page.$x("//*[contains(@itemprop, 'image')][@src]");
                  if (imgHandle_6.length > 0) {
                    let image_6 = await page.evaluate(el => el.getAttribute("src"), imgHandle_6[0]);
                    if (image_6.startsWith("http")) {
                      final_object["image"] = image_6;
                    } else {
                      final_object["image"] = "http://" + psl.get(extractHostname(page.url())) + image_6;
                    }
                  }
                }
              }
            }
          }
        }

      await browser.close();
    } catch (e) {
      console.error(e);
    } finally {
      await res.json(final_object);
    }
  })();
});

module.exports = router;
