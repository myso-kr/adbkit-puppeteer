import _ from 'lodash';
import Promise from 'bluebird';

import Devices from '../devices';
import Page from 'puppeteer/lib/Page';
Page.prototype.setViewport = ((o) => {
  return async function(opts = {}) {
    const device = _.get(Devices, _.get(opts, 'modelName'));
    if(device) {
      const client = _.get(this, '_client._connection.adb.client');
      const serial = _.get(this, '_client._connection.adb.serial');
      const deviceSettings = _.map(device, (v, k) => ({ key: k, value: v }));
      const defines = await Promise.map(deviceSettings, async (setting) => {
        if(setting.key == 'window.navigator.userAgent') {
          await this.setUserAgent(setting.value);
        }
        if(setting.key == 'window.innerWidth') {
          _.set(opts, 'width' , setting.value);
        }
        if(setting.key == 'window.outerHeight') {
          _.set(opts, 'height', setting.value);
        }
        if(setting.key == 'window.devicePixelRatio') {
          _.set(opts, 'deviceScaleFactor' , setting.value);
        }
        if(setting.key == 'window.navigator.platform' && setting.value.indexOf(setting.key, 'arm') != -1) {
          _.set(opts, 'isMobile', true);
          _.set(opts, 'hasTouch', true);
        }
        const attrPath = setting.key.split('.');
        const attrName = _.join(_.dropRight(attrPath), '.');
        const attrType = _.nth(attrPath, -1);
        const attrValue = _.isString(setting.value) ? `"${setting.value}"` : setting.value;
        return `Object.defineProperty(${attrName}, "${attrType}", { get: function() { return ${attrValue}; }, set: function(v) {} });`
      })
      console.log(defines.join('\n'));
      await this.evaluateOnNewDocument(defines.join('\n'));
    }
    _.unset(opts, 'modelName');
    return o.apply(this, [opts]);
  }
})(Page.prototype.setViewport);