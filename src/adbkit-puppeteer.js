import _ from 'lodash';
import Promise from 'bluebird';

import ADB from 'adbkit';
import Client from 'adbkit/lib/adb/client';

import Chrome from 'puppeteer';
import './adbkit-puppeteer-keyboard';
import './adbkit-puppeteer-mouse';
import './adbkit-puppeteer-element';

Client.prototype.puppeteer = async function(serial, options) {
  const opts = _.defaultsDeep(options, {
    port: 9222,
    noReset: false,
    args: [],
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
    chromeCommandLine.push.apply(chromeCommandLine, opts.args);
    if(!opts.noReset) {
      await this.shellWait(serial, `am force-stop ${CHROME_PACKAGES}`);
      await this.shellWait(serial, `pm clear ${CHROME_PACKAGES}`);
    }
    if(_.isFunction(opts.preload)) await opts.preload();
    await this.shellWait(serial, `echo "chrome ${chromeCommandLine.join(' ')}" > /data/local/tmp/chrome-command-line`);
    await this.shellWait(serial, `am set-debug-app --persistent ${CHROME_PACKAGES}`);
    await this.shellWait(serial, `am start -n ${CHROME_PACKAGES}/${CHROME_ACTIVITY} -d 'data:,'`);
    await Promise.delay(5000);
    if(_.isFunction(opts.postload)) await opts.postload();
    const chrome = Chrome.connect({
      adb: this, adbSerial: serial,
      browserWSEndpoint: `ws://127.0.0.1:${opts.port}/devtools/browser`
    });
    return chrome;
  }
}