import _ from 'lodash';
import Promise from 'bluebird';

import File from 'fs';

import '../lib/puppeteer';
import adb from 'adbkit';
import puppeteer from 'puppeteer';

const CHROME_PACKAGES = 'com.android.chrome'
const CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
const CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
const REMOTE_KEYBOARD = 'com.android.inputmethod.korean/.SoftKeyboard';

const client = adb.createClient();

(async () => {
  await Promise.mapSeries(client.listDevices(), async function looper(device) {
    const controller = await client.puppeteer(device.id, {
      port: 9222,
      userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G935K Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36'
    });
    const browser = await controller.connect();
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(`
      Object.defineProperty(navigator, 'platform', {
        get: function() { return 'Linux armv8l' }
        set: function(v) {}
      });
      Object.defineProperty(navigator.connection, 'type', {
        get: function() { return 'cellular' }
        set: function(v) {}
      });
      Object.defineProperty(navigator.connection, 'effectiveType', {
        get: function() { return '4g' }
        set: function(v) {}
      });
      Object.defineProperty(window, 'devicePixelRatio', {
         get: function(){ return 1; },
         set: function(v){},
      });
      WebGLRenderingContext.prototype.getParameter = (function(o) {
        return function(id){
          var info = this.getExtension("WEBGL_debug_renderer_info");
          if(id === info.UNMASKED_RENDERER_WEBGL) return "Mali-T880";
          if(id === info.UNMASKED_VENDOR_WEBGL)   return "ARM";
          return o.apply(this, [id]);
        }
      })(WebGLRenderingContext.prototype.getParameter);
    `);
    await page.on("dialog", async (dialog) => dialog.dismiss());
    await page.on("error", async (dialog) => process.exit());
    await page.goto('https://m.naver.com');
    await Promise.delay(3000);
    await page.waitFor('#query');
    const query1 = await page.$('#query');
    if(query1) {
      await query1.click('#query', {});
      console.log('a');
      await page.keyboard.type('강원도 산골짜기2\n');
    }
    await page.waitFor('#nx_query');
    const query2 = await page.$('#nx_query');
    if(query2) {
      await query2.click('#nx_query', {});
      await page.keyboard.type('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b');
      await page.keyboard.type('강원도 산기슭3\n');
    }
    await Promise.delay(5000);

    await page.close();
    await browser.disconnect();

    looper(device);
  })
})();
