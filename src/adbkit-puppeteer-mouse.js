import _ from 'lodash';
import Promise from 'bluebird';

import ElementHandle from 'puppeteer/lib/ElementHandle';

ElementHandle.prototype.click = ((o) => {
  return async function(options = {}) {
    if(_.has(options, 'x') && _.has(options, 'y')) {
      await this._scrollIntoViewIfNeeded();
      const rect = await this.boundingBox();
      const size = await this.boxModel();
      let centerX = rect.x + rect.width / 2;
      let centerY = rect.y + rect.height / 2;
      const lt = {
        x: Math.max(size.content[0].x, size.padding[0].x, size.border[0].x, size.margin[0].x),
        y: Math.max(size.content[0].y, size.padding[0].y, size.border[0].y, size.margin[0].y),
      }
      const rb = {
        x: Math.min(size.content[2].x, size.padding[2].x, size.border[2].x, size.margin[2].x),
        y: Math.min(size.content[2].y, size.padding[2].y, size.border[2].y, size.margin[2].y),
      }
      if(options.x === true) options.x = _.random(lt.x + 1, rb.x - 1);
      if(options.x === undefined) options.x = centerX;
      if(options.x <= lt.x) options.x = lt.x + 1;
      if(options.x >= rb.x) options.x = rb.x - 1;
      if(options.y === true) options.y = _.random(lt.y + 1, rb.y - 1);
      if(options.y === undefined) options.y = centerY;
      if(options.y <= lt.y) options.y = lt.y + 1;
      if(options.y >= rb.y) options.y = rb.y - 1;
      await this._page.mouse.click(options.x, options.y, _.omit(options, 'x', 'y'));
    } else {
      return o.apply(this, [options]);
    }
  }
})(ElementHandle.prototype.click);

ElementHandle.prototype.tap = ((o) => {
  return async function(options = {}) {
    if(_.has(options, 'x') && _.has(options, 'y')) {
      await this._scrollIntoViewIfNeeded();
      const rect = await this.boundingBox();
      const size = await this.boxModel();
      let centerX = rect.x + rect.width / 2;
      let centerY = rect.y + rect.height / 2;
      const lt = {
        x: Math.max(size.content[0].x, size.padding[0].x, size.border[0].x, size.margin[0].x),
        y: Math.max(size.content[0].y, size.padding[0].y, size.border[0].y, size.margin[0].y),
      }
      const rb = {
        x: Math.min(size.content[2].x, size.padding[2].x, size.border[2].x, size.margin[2].x),
        y: Math.min(size.content[2].y, size.padding[2].y, size.border[2].y, size.margin[2].y),
      }
      if(options.x === true) options.x = _.random(lt.x + 1, rb.x - 1);
      if(options.x === undefined) options.x = centerX;
      if(options.x <= lt.x) options.x = lt.x + 1;
      if(options.x >= rb.x) options.x = rb.x - 1;
      if(options.y === true) options.y = _.random(lt.y + 1, rb.y - 1);
      if(options.y === undefined) options.y = centerY;
      if(options.y <= lt.y) options.y = lt.y + 1;
      if(options.y >= rb.y) options.y = rb.y - 1;
      await this._page.touchscreen.tap(options.x, options.y);
    } else {
      return o.apply(this, [options]);
    }
  }
})(ElementHandle.prototype.tap);
