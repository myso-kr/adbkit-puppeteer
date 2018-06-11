import _ from 'lodash';
import Promise from 'bluebird';

import File from 'fs';

import adb from 'adbkit';
import '../lib/adbkit-puppeteer';

import UIAutomator from 'uiautomator-server';

const CHROME_PACKAGES = 'com.android.chrome'
const CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
const CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
const REMOTE_KEYBOARD = 'com.aosp.inputmethod.korean/.SoftKeyboard';

const client = adb.createClient();

(async () => {
  await Promise.mapSeries(client.listDevices(), async function looper(device) {
    try {
      const browser = await client.puppeteer(device.id, { port: 9222 });
            browser.on('disconnected', async () => looper(device))
      const pages = await browser.pages();
      const page = pages.length ? pages[0] : (await browser.newPage());

      await Promise.resolve().then(async () => {
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 7.0; SM-G935K Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36');
        await page.setViewport({ width: 412, height: 652, deviceScaleFactor: 3.5, isMobile: true, hasTouch: true })
        await page.evaluateOnNewDocument(`
          Object.defineProperty(navigator, 'platform', {
            get: function() { return 'Linux armv8l' },
            set: function(v) {}
          });
          Object.defineProperty(navigator.connection, 'type', {
            get: function() { return 'cellular' },
            set: function(v) {}
          });
          Object.defineProperty(navigator.connection, 'effectiveType', {
            get: function() { return '4g' },
            set: function(v) {}
          });
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
        await page.goto('http://m.naver.com');

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
