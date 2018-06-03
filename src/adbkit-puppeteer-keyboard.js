import _ from 'lodash';
import Promise from 'bluebird';

import Launcher from 'puppeteer/lib/Launcher';
import { Keyboard } from 'puppeteer/lib/Input';

import './adbkit-shell-wait';

Launcher.connect = ((o) => {
  return async function(options) {
    console.log(options);
    const client = await o.apply(this, [options]);
    _.set(client, '_connection.adb.client', _.get(options, 'adb'));
    _.set(client, '_connection.adb.serial', _.get(options, 'adbSerial'));
    return client;
  }
})(Launcher.connect);

Keyboard.prototype.type = ((o) => {
  const KEYBOARD_PACKAGES = 'com.android.inputmethod.korean'
  const KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return async function(text, ...args) {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');
    console.log(client, serial);
    if(!client || !serial || !(await client.isInstalled(serial, KEYBOARD_PACKAGES))) {
      return o.apply(this, [text, ...args]);
    } else {
      await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      text = text.replace(/(["\s'$`\\])/g,'\\$1');
      return client.shellWait(serial, `am broadcast -a ADB_INPUT_TEXT --es msg '${text}'`);
    }
  }
})(Keyboard.prototype.type);