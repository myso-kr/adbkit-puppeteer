import _ from 'lodash';
import Promise from 'bluebird';

import Path from 'path';

import Browser from 'puppeteer/lib/Browser';
Browser.prototype.newPage = ((o) => {
  const KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean'
  return async function(...args) {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');

    const page = await o.apply(this, args);
    if(!(await client.isInstalled(serial, KEYBOARD_PACKAGES))) {
      await client.install(serial, Path.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));
      await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
    }
    return page;
  }
})(Browser.prototype.newPage);
Browser.prototype.pages = ((o) => {
  const KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean'
  return async function(...args) {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');

    const pages = await o.apply(this, args);
    if(!(await client.isInstalled(serial, KEYBOARD_PACKAGES))) {
      await client.install(serial, Path.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));
      await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
    }
    return pages;
  }
})(Browser.prototype.pages);

import { Keyboard } from 'puppeteer/lib/Input';
Keyboard.prototype.type = ((o) => {
  const KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean'
  const KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return async function(text, ...args) {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');
    if(!client || !serial) { throw new Error(''); }
    await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
    await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
    await client.shellWait(serial, `am broadcast -a ADB_INPUT_TEXT --es msg '${text.replace(/(["\s'$`\\])/g,'\\$1')}'`);
  }
})(Keyboard.prototype.type);