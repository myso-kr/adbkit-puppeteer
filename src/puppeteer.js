import _ from 'lodash';
import Promise from 'bluebird';
import Net from 'net';

import ChildProcess from 'child-process-promise';

import Launcher from 'puppeteer/lib/Launcher';
import Browser from 'puppeteer/lib/Browser';
import { Keyboard } from 'puppeteer/lib/Input';

Keyboard.prototype.type = async function(text) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  return ChildProcess.exec(`adb -s ${serial} shell am broadcast -a ADB_INPUT_TEXT --es msg '${text.replace(/(["\s'$`\\])/g,'\\$1').replace(/\n/g, '\\n')}'`);
}


import puppeteer from 'puppeteer';
import Client from 'adbkit/lib/adb/client';

class PupeteerADB {
  constructor(client, serial, options) {
    this.CHROME_PACKAGES = 'com.android.chrome'
    this.CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
    this.CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
    this.REMOTE_KEYBOARD = 'com.android.inputmethod.korean/.SoftKeyboard';

    this.client = client;
    this.serial = serial;
    this.opts = _.defaultsDeep(options, { port: 9222, userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G935K Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36' });
  }

  async __keyboard_install() {
    if(!(await this.client.isInstalled(this.serial, this.REMOTE_KEYBOARD))) {
      //await client.install()
    }
    await this.client.shell(this.serial, `ime enable ${this.REMOTE_KEYBOARD}`);
    await this.client.shell(this.serial, `ime set ${this.REMOTE_KEYBOARD}`);
  }

  async __chrome_install() {
    if(!(await this.client.isInstalled(this.serial, this.CHROME_PACKAGES))) {
      //await client.install()
    }

    const forwards = await this.client.listForwards(this.serial);
    if(!_.find(forwards, { remote: this.CHROME_PROTOCOL })) {
      await this.client.forward(this.serial, `tcp:${this.opts.port}`, this.CHROME_PROTOCOL);
    }
  }

  async __chrome_start() {
    await this.client.shell(this.serial, `echo "chrome --disable-fre --no-default-browser-check --no-first-run --user-agent='${this.opts.userAgent}'" > /data/local/tmp/chrome-command-line`);
    await this.client.shell(this.serial, `am set-debug-app --persistent ${this.CHROME_PACKAGES}`);
    await this.client.shell(this.serial, `am start -n ${this.CHROME_PACKAGES}/${this.CHROME_ACTIVITY} -d 'data:,'`);
    await Promise.delay(5000);
  }

  async __chrome_stop() {
    await this.client.shell(this.serial, `am force-stop ${this.CHROME_PACKAGES}`);
  }

  async __chrome_restart() {
    await this.__chrome_apps_stop();
    await this.__chrome_apps_start();
  }

  async __chrome_data_restore() {

  }

  async __chrome_data_backup() {

  }

  async __chrome_data_reset() {
    await this.client.shell(this.serial, `pm clear ${this.CHROME_PACKAGES}`);
    await Promise.delay(1000);
  }

  async __chrome_connect() {
    const connect_checker = () => {
      return new Promise((resolve, reject) => {
        const socket = new Net.Socket();
        socket.on('error', reject);
        socket.connect(this.opts.port, '127.0.0.1', () => resolve(socket.destroy()));
      }).delay(1000).catch(connect_checker)
    }
    return connect_checker().then(async () => {
      const client = await puppeteer.connect({ browserWSEndpoint: `ws://127.0.0.1:${this.opts.port}/devtools/browser` });
      _.set(client, '_connection.adb.client', this.client);
      _.set(client, '_connection.adb.serial', this.serial);
      return client;
    }).timeout(15000)
  }

  async connect() {
    await this.__keyboard_install();
    await this.__chrome_install();
    await this.__chrome_data_reset();
    await this.__chrome_start();
    return this.__chrome_connect();
  }
}

Client.prototype.puppeteer = function(serial, options, callback) {
  return this.connection().then((conn) => new PupeteerADB(this, serial, options)).nodeify(callback);
}