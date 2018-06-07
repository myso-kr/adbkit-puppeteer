import _ from 'lodash';
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

import { Mouse, Touchscreen } from 'puppeteer/lib/Input';
// Mouse.prototype.move = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.down = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.up = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.click = async function(x, y, options) {
//   return this._page.touchscreen.tap(x, y, options);
// }

Touchscreen.prototype.tap = async function(x, y) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  // const device_viewport = await client.screen(serial);
  // const screen_viewport = this._page.viewport();
  // const dx = Math.floor(x * device_viewport.deviceScaleFactor);
  // const dy = Math.floor(y * device_viewport.deviceScaleFactor);
  // console.log('tap', dx, dy);
  await client.shellWait(serial, `input touchscreen tap ${x} ${y}`);
  await Promise.delay(1000);
}
Touchscreen.prototype.swipe = async function(x1, y1, x2, y2, options = { duration: 500 }) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  // const device_viewport = await client.screen(serial);
  // const screen_viewport = this._page.viewport();

  // const dx1 = Math.floor(x1 * device_viewport.deviceScaleFactor);
  // const dy1 = Math.floor(y2 * device_viewport.deviceScaleFactor);
  // const dx2 = Math.floor(x2 * device_viewport.deviceScaleFactor);
  // const dy2 = Math.floor(y2 * device_viewport.deviceScaleFactor);
  await client.shellWait(serial, `input touchscreen swipe ${dx1} ${dy1} ${dx2} ${dy2} ${options.duration}`);
}

Touchscreen.prototype.swipeDirection = async function(direction, length = 100, options = { duration: 500 }) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  const device_viewport = await client.screen(serial);

  const cx = device_viewport.width / 2;
  const cy = device_viewport.height / 2;
  switch(direction) {
    case 'u': case 'up':
      await client.shellWait(serial, `input touchscreen swipe ${cx} ${cy} ${cx} ${cy + length} ${options.duration}`);
    break;
    case 'd': case 'down':
      await client.shellWait(serial, `input touchscreen swipe ${cx} ${cy} ${cx} ${cy - length} ${options.duration}`);
    break;
    case 'l': case 'left':
      await client.shellWait(serial, `input touchscreen swipe ${cx} ${cy} ${cx} ${cy + length} ${options.duration}`);
    break;
    case 'r': case 'right':
      await client.shellWait(serial, `input touchscreen swipe ${cx} ${cy} ${cx} ${cy - length} ${options.duration}`);
    break;
    default:
      throw new Error('');
  }
}

import ElementHandle from 'puppeteer/lib/ElementHandle';
ElementHandle.prototype.tap_by_filter = async function(x, y, filter, offset = 0) {

}
ElementHandle.prototype.tap_by_path = async function(x, y, filter) {

}

ElementHandle.prototype.tap = async function(x, y, filter, offset = 0) {
  const client = _.get(this, '_client._connection.adb.client');
  const serial = _.get(this, '_client._connection.adb.serial');
  const ui = _.get(this, '_client._connection.ui.client');
  const ui_dump = await ui.dump(true);
  if(XML.validate(ui_dump) !== true) { throw new Error('not xml'); }
  const ui_json = XML.parse(ui_dump, XML_OPTIONS);
  const ui_json_flat = (collection) => {
    const flat = _.reduce(collection, (o, v, k) => {
      if(_.isArray(v)) {
        o.push.apply(o, ui_json_flat(v));
      } else if(_.isPlainObject(v)) {
        o.push(_.omit(v, 'node'));
        o.push.apply(o, ui_json_flat(v));
      }
      return o;
    }, []);
    const bound = (v) => {
      const PT_BOUNDS = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g
      if(v && _.isString(v.bounds)) {
        const MT_BOUNDS = PT_BOUNDS.exec(v.bounds);
        v.bounds = {
          x1: parseInt(_.nth(MT_BOUNDS, 1)),
          y1: parseInt(_.nth(MT_BOUNDS, 2)),
          x2: parseInt(_.nth(MT_BOUNDS, 3)),
          y2: parseInt(_.nth(MT_BOUNDS, 4)),
        };  
      }
      return v;
    };
    return flat.map(bound);
  }
  const ui_flat = ui_json_flat(ui_json);
  if (_.isPlainObject(filter) || _.isFunction(filter)) {
    const ui_json_find = _.nth(_.filter(ui_flat, filter), offset);
    if(ui_json_find) {
      const dx = _.isEmpty(x) ? _.random(ui_json_find.bounds.x1, ui_json_find.bounds.x2) : Math.max(Math.min(x, ui_json_find.bounds.x2), ui_json_find.bounds.x1);
      const dy = _.isEmpty(y) ? _.random(ui_json_find.bounds.y1, ui_json_find.bounds.y2) : Math.max(Math.min(y, ui_json_find.bounds.y2), ui_json_find.bounds.y1);
      await client.shellWait(serial, `input touchscreen tap ${dx} ${dy}`);
      await Promise.delay(1000);
    }  
  } else if(_.isString(filter)) {
    const ui_json_find = _.get(ui_flat, filter);
    if(ui_json_find) {
      const dx = _.isEmpty(x) ? _.random(ui_json_find.bounds.x1, ui_json_find.bounds.x2) : Math.max(Math.min(x, ui_json_find.bounds.x2), ui_json_find.bounds.x1);
      const dy = _.isEmpty(y) ? _.random(ui_json_find.bounds.y1, ui_json_find.bounds.y2) : Math.max(Math.min(y, ui_json_find.bounds.y2), ui_json_find.bounds.y1);
      await client.shellWait(serial, `input touchscreen tap ${dx} ${dy}`);
      await Promise.delay(1000);
    }
  } else if(!_.isEmpty(x) && !_.isEmpty(y)) {
    return this._page.touchscreen.tap(x, y);
  } else {
    throw new Error('');
  }
}