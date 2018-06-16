import _ from 'lodash';
import Promise from 'bluebird';

import Launcher from 'puppeteer/lib/Launcher';
Launcher.connect = ((o) => {
  return async function(options) {
    const launcher = await o.apply(this, [options]);

    const client = _.get(options, 'adb.client');
    const serial = _.get(options, 'adb.serial');
    _.set(launcher, '_connection.adb.client', client);
    _.set(launcher, '_connection.adb.serial', serial);

    const ui = await client.uiautomator(serial, _.get(options, 'ui'));
    await ui.start(true);
    _.set(launcher, '_connection.ui.client', ui);
    _.set(launcher, '_connection.ui.serial', serial);
    launcher.on('disconnected', () => ui.stop());
    
    return launcher;
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
