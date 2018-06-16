import _ from 'lodash';
import Promise from 'bluebird';

import UIAutomator from 'uiautomator-server';
import Launcher from 'puppeteer/lib/Launcher';
Launcher.connect = ((o) => {
  return async function(options) {
    const client = await o.apply(this, [options]);
    _.set(client, '_connection.adb.client', _.get(options, 'adb.client'));
    _.set(client, '_connection.adb.serial', _.get(options, 'adb.serial'));

    const ui = await client.uiautomator(_.get(options, 'adb.serial'), _.get(options, 'ui'));
    await ui.start(true);
    _.set(client, '_connection.ui.client', ui);
    _.set(client, '_connection.ui.serial', _.get(options, 'ui.serial'));
    client.on('disconnected', () => ui.stop());
    return client;
  }
})(Launcher.connect);

import Browser from 'puppeteer/lib/Browser';
Browser.prototype.newPage = ((o) => {
  return async function(...args) {
    const page = await o.apply(this, args);
    _.set(page, '_browser', this);
    console.log('Browser.newPage', page);
    return page;
  }
})(Browser.prototype.newPage);
Browser.prototype.pages = ((o) => {
  return async function(...args) {
    const pages = await o.apply(this, args);
    _.each(pages, (page)=>_.set(page, '_browser', this));
    return pages;
  }
})(Browser.prototype.pages);

import Page from 'puppeteer/lib/Page';
Object.defineProperty(Page.prototype, 'keyboard', {
  get: function(){
    _.set(this._keyboard, '_page', this);
    return this._keyboard;
  }
})
Object.defineProperty(Page.prototype, 'mouse', {
  get: function(){
    _.set(this._mouse, '_page', this);
    return this._mouse;
  }
})
Object.defineProperty(Page.prototype, 'touchscreen', {
  get: function(){
    _.set(this._touchscreen, '_page', this);
    return this._touchscreen;
  }
})
