import _ from 'lodash';
import Promise from 'bluebird';

import Page from 'puppeteer/lib/Page';
((o, g) => {
  Page.prototype.evaluateOnNewDocument = async function(pageFunction, ...args) {
    this.pageFunctions = this.pageFunctions || ["for(var f in console) console[f] = () => {};"];
    if(args.length) throw new Error('cannot use arguments');
    this.pageFunctions.push(pageFunction);
  }
  Page.prototype.goto = async function(url, options) {
    this.pageFunctions = this.pageFunctions || ["for(var f in console) console[f] = () => {};"];
    await o.apply(this, [this.pageFunctions.join(';\n')]);
    await g.apply(this, [url, options]);
  }
})(Page.prototype.evaluateOnNewDocument, Page.prototype.goto);