import _ from 'lodash';
import './lodash-filter-deep';

import Promise from 'bluebird';

import { inspect } from 'util';
import XML from 'fast-xml-parser';
const XML_OPTIONS = {
    attributeNamePrefix : "",
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: true
};

import { Touchscreen } from 'puppeteer/lib/Input';
Touchscreen.prototype.tap = async function(x, y) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  const ui = _.get(this, '_client._connection.ui.client');

  const device_viewport = await client.screen(serial);
  const screen_viewport = this._page.viewport();

  // const ui_dump = await ui.dump(false);
  await client.shellWait(serial, 'uiautomator dump').delay(3000);
  const ui_dump = await client.shellWait(serial, 'cat /sdcard/window_dump.xml');
  const ui_view = _.findDeep(XML.parse(ui_dump, XML_OPTIONS), { class: "android.webkit.WebView" });
  if(ui_view) {
    const ui_bnds = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g.exec(ui_view.bounds);
    const ui_rect = _.zipObject(['x1', 'y1', 'x2', 'y2'], [parseInt(ui_bnds[1]), parseInt(ui_bnds[2]), parseInt(ui_bnds[3]), parseInt(ui_bnds[4])]);

    let dx = Math.floor(x * device_viewport.deviceScaleFactor);
    let dy = Math.floor(y * device_viewport.deviceScaleFactor);

    dx = dx + ui_rect.x1;
    dy = dy + ui_rect.y1;

    dx = Math.min(Math.max(dx, ui_rect.x1), ui_rect.x2);
    dy = Math.min(Math.max(dy, ui_rect.y1), ui_rect.y2);

    await client.shellWait(serial, `input touchscreen tap ${dx} ${dy}`);
    await Promise.delay(1000);
  } else {
    await Promise.delay(1000);
    await this.tap(x, y);
  }
}
Touchscreen.prototype.swipe = async function(x1, y1, x2, y2, options = { duration: 500 }) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  const ui = _.get(this, '_client._connection.ui.client');

  const device_viewport = await client.screen(serial);
  const screen_viewport = this._page.viewport();

  // const ui_dump = await ui.dump(false);
  await client.shellWait(serial, 'uiautomator dump').delay(3000);
  const ui_dump = await client.shellWait(serial, 'cat /sdcard/window_dump.xml');
  const ui_view = _.findDeep(XML.parse(ui_dump, XML_OPTIONS), { class: "android.webkit.WebView" });
  if(ui_view) {
    const ui_bnds = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g.exec(ui_view.bounds);
    const ui_rect = _.zipObject(['x1', 'y1', 'x2', 'y2'], [parseInt(ui_bnds[1]), parseInt(ui_bnds[2]), parseInt(ui_bnds[3]), parseInt(ui_bnds[4])]);

    let dx1 = Math.floor(x1 * device_viewport.deviceScaleFactor);
    let dy1 = Math.floor(y1 * device_viewport.deviceScaleFactor);
    let dx2 = Math.floor(x2 * device_viewport.deviceScaleFactor);
    let dy2 = Math.floor(y2 * device_viewport.deviceScaleFactor);

    dx1 = dx1 + ui_rect.x1;
    dy1 = dy1 + ui_rect.y1;
    dx2 = dx2 + ui_rect.x1;
    dy2 = dy2 + ui_rect.y1;

    dx1 = Math.min(Math.max(dx1, ui_rect.x1), ui_rect.x2);
    dy1 = Math.min(Math.max(dy1, ui_rect.y1), ui_rect.y2);
    dx2 = Math.min(Math.max(dx2, ui_rect.x1), ui_rect.x2);
    dy2 = Math.min(Math.max(dy2, ui_rect.y1), ui_rect.y2);

    await client.shellWait(serial, `input touchscreen swipe ${dx1} ${dy1} ${dx2} ${dy2} ${options.duration}`);
    await Promise.delay(1000);
  } else {
    await Promise.delay(1000);
    await this.swipe(x1, y1, x2, y2, options);
  }
}
Touchscreen.prototype.swipeDirection = async function(direction, length = 100, options = { duration: 500 }) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  const screen_viewport = this._page.viewport();

  const cx = screen_viewport.width / 2;
  const cy = screen_viewport.height / 2;
  switch(direction) {
    case 'u': case 'up':
      await this.swipe(cx, cy, cx, cy + length, options);
    break;
    case 'd': case 'down':
      await this.swipe(cx, cy, cx, cy - length, options);
    break;
    case 'l': case 'left':
      await this.swipe(cx, cy, cx + length, cy, options);
    break;
    case 'r': case 'right':
      await this.swipe(cx, cy, cx - length, cy, options);
    break;
  }
}

import ElementHandle from 'puppeteer/lib/ElementHandle';
ElementHandle.prototype.tap = async function(x, y) {
  return Promise.resolve()
  .then(async () => {
    const client = _.get(this, '_client._connection.adb.client');
    const serial = _.get(this, '_client._connection.adb.serial');
    
    const screen_viewport = this._page.viewport();
    const el_hide = await this.executionContext().evaluate((el) => {
      if (!el.isConnected) return 'Node is detached from document';
      if (el.nodeType !== Node.ELEMENT_NODE) return 'Node is not of type HTMLElement';
      const bounding = el.getBoundingClientRect();
      const boundingT = bounding.top >= 0;
      const boundingL = bounding.left >= 0;
      const boundingB = bounding.bottom <= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const boundingR = bounding.right <= Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (!boundingT) return 'boundingT';
      if (!boundingL) return 'boundingL';
      if (!boundingB) return 'boundingB';
      if (!boundingR) return 'boundingR';
      return false;
    }, this);
    if(el_hide) {
      switch(el_hide) {
        case 'boundingT':
          await this._page.touchscreen.swipeDirection('u', screen_viewport.height / 2);
          return this.tap(x, y);
        break;
        case 'boundingL':
          await this._page.touchscreen.swipeDirection('r', screen_viewport.width / 2);
          return this.tap(x, y);
        break;
        case 'boundingB':
          await this._page.touchscreen.swipeDirection('d', screen_viewport.height / 2);
          return this.tap(x, y);
        break;
        case 'boundingR':
          await this._page.touchscreen.swipeDirection('l', screen_viewport.width / 2);
          return this.tap(x, y);
        break;
        default:
          throw new Error(el_hide);
      }
    }

    const el_rect = await this.boxModel();
    x = (_.isEmpty(x)) ? _.random(el_rect.padding[0].x, el_rect.padding[2].x) : x + el_rect.padding[0].x;
    y = (_.isEmpty(y)) ? _.random(el_rect.padding[0].y, el_rect.padding[2].y) : y + el_rect.padding[0].y;
    x = Math.min(Math.max(x, el_rect.padding[0].x), el_rect.padding[0].x);
    y = Math.min(Math.max(y, el_rect.padding[0].y), el_rect.padding[2].y);
    await this._page.touchscreen.tap(x, y);
  }).timeout(300000)
}