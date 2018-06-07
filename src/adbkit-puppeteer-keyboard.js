import _ from 'lodash';
import Promise from 'bluebird';

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