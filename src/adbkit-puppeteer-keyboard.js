import _ from 'lodash';
import Promise from 'bluebird';

import Path from 'path';

import { Keyboard } from 'puppeteer/lib/Input';
// Keyboard.prototype.down   = () => { throw new Error(''); }
// Keyboard.prototype.up     = () => { throw new Error(''); }
// Keyboard.prototype.press  = () => { throw new Error(''); }
Keyboard.prototype.type = ((o) => {
  const KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean'
  const KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return async function(text, ...args) {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');
    if(!client || !serial) { throw new Error(''); }
    if(!(await client.isInstalled(serial, KEYBOARD_PACKAGES))) {
      await client.install(serial, Path.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));
      await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await Promise.delay(3000);
    } else {
      await client.shellWait(serial, `ime enable ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
      await client.shellWait(serial, `ime set ${KEYBOARD_PACKAGES}/${KEYBOARD_ACTIVITY}`);
    }
    await client.shellWait(serial, `am broadcast -a ADB_INPUT_TEXT --es msg '${text.replace(/(["\s'$`\\])/g,'\\$1')}'`);
  }
})(Keyboard.prototype.type);