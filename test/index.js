import _ from 'lodash';
import Promise from 'bluebird';

import File from 'fs';

import adb from 'adbkit';
import '../lib/adbkit-puppeteer';

import UIAutomator from 'uiautomator-server';

const client = adb.createClient();
(async () => {
  await Promise.mapSeries(client.listDevices(), async function looper(device) {
    try {
      const browser = await client.puppeteer(device.id, { port: 9222 });
            browser.on('disconnected', async () => looper(device))
      const pages = await browser.pages();
      const page = pages.length ? pages[0] : (await browser.newPage());

      await Promise.resolve().then(async () => {
        await page.setViewport({ modelName: 'SM-G935K' })
        await page.evaluateOnNewDocument(`
          WebGLRenderingContext.prototype.getParameter = (function(o) {
            return function(id){
              var info = this.getExtension("WEBGL_debug_renderer_info");
              if(id == info.UNMASKED_RENDERER_WEBGL) return "Mali-T810";
              if(id == info.UNMASKED_VENDOR_WEBGL)   return "ARM";
              return o.call(this, id);
            }
          })(WebGLRenderingContext.prototype.getParameter);
        `);
        await page.on("dialog", async (dialog) => dialog.dismiss());
        await page.on("error", async (dialog) => process.exit());
        
        // http://167.99.66.63/info.php
        // await page.goto('http://unixpapa.com/js/testkey.html');
        // await page.goto('http://167.99.66.63/info.php');
        await page.goto('https://210.89.164.157');
        // await page.goto('https://jsbin.com/cecuzeb/edit?output');

        await page.waitFor(1000);
        const query1 = await page.waitFor('#query');
        if(query1) {
          await Promise.delay(1000);
          await query1.tap();
          await query1.type('한글\n');
        }

        await page.waitFor('.total_wrap');
        const anchor = _.sample(await page.$$('.total_wrap a'));
        if(anchor) {
          await Promise.delay(1000);
          await anchor.tap();
        }

        await Promise.mapSeries(_.range(10), () => page.touchscreen.swipeDirection(_.sample(['d', 'u']), _.random(300, 500)));
        // await Promise.delay(10000);
      })
      .timeout(120000)
      .catch((e) => console.error(e))
      .finally(async () => {
        await page.close();
        await browser.disconnect();
      });
    }catch (e) {
      console.error(e);
      await looper(device);
    }
  })
})();
