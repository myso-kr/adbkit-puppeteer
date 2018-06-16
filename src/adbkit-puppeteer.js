import Logger from 'debug';
const logger = Logger('adbkit-puppeteer');

import _ from 'lodash';
import Promise from 'bluebird';

import Chrome from 'puppeteer';
import ADB from 'adbkit';
import './adbkit-shell-wait';
import './adbkit-screen';
import './adbkit-puppeteer-uiautomator';
import './adbkit-puppeteer-bridge';
import './adbkit-puppeteer-evaluate-on-new-document';
import './adbkit-puppeteer-keyboard';
import './adbkit-puppeteer-mouse';
import './adbkit-puppeteer-element';
import './adbkit-puppeteer-viewport';


import Client from 'adbkit/lib/adb/client';
Client.prototype.puppeteer = async function(serial, options) {
  const opts = _.defaultsDeep(options, {
    args: [],
    port: 9222,
    uiport: 9008,
    noReset: false,
    handler: {
      async chrome_exit() {
        logger(serial, `chrome_exit`);
      },
      async chrome_clear() {
        logger(serial, `chrome_clear`);
      },
      async chrome_connect() {
        logger(serial, `chrome_connect`);
      },
      async chrome_disconnect() {
        logger(serial, `chrome_disconnect`);
      },
      async chrome_preload() {
        logger(serial, `chrome_preload`);
      },
      async chrome_load() {
        logger(serial, `chrome_load`);
      },
      async chrome_ready() {
        logger(serial, `chrome_ready`);
      },
    }
  });

  const CHROME_PACKAGES = 'com.android.chrome'
  const CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
  const CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';

  if(!(await this.isInstalled(serial, CHROME_PACKAGES))) {
    throw new Error('chrome not found!');
  } else {
    const forwards = await this.listForwards(serial);
    if(!_.find(forwards, { remote: CHROME_PROTOCOL })) {
      await this.forward(serial, `tcp:${opts.port}`, CHROME_PROTOCOL);
    }
    const chromeCommandLine = [];
    chromeCommandLine.push('--disable-fre');
    chromeCommandLine.push('--no-default-browser-check');
    chromeCommandLine.push('--no-first-run');
    chromeCommandLine.push('--ignore-certificate-errors');
    chromeCommandLine.push.apply(chromeCommandLine, opts.args);
    await this.shellWait(serial, `am force-stop ${CHROME_PACKAGES}`);
    if(!opts.noReset) {
      await this.shellWait(serial, `pm clear ${CHROME_PACKAGES}`);
      await opts.handler.chrome_clear();
    }
    await opts.handler.chrome_preload();
    await this.shellWait(serial, `echo "chrome ${chromeCommandLine.join(' ')}" > /data/local/tmp/chrome-command-line`);
    await this.shellWait(serial, `am set-debug-app --persistent ${CHROME_PACKAGES}`);
    await this.shellWait(serial, `am start -n ${CHROME_PACKAGES}/${CHROME_ACTIVITY} -d 'data:,'`);
    await Promise.delay(5000);
    await opts.handler.chrome_load();

    const chrome = await Chrome.connect({
      adb: { client: this, serial: serial },
      ui: { port: opts.uiport, serial: serial, connectionTriesDelay: 3000, connectionMaxTries: 15 },
      browserWSEndpoint: `ws://127.0.0.1:${opts.port}/devtools/browser`,
    });
    chrome.on('disconnected', async () => {
      await this.shellWait(serial, `am force-stop ${CHROME_PACKAGES}`);
      await this.shellWait(serial, `rm -f /data/local/tmp/chrome-command-line`);
      await opts.handler.chrome_disconnect(chrome)
    })
    await opts.handler.chrome_ready(chrome);
    return chrome;
  }
}