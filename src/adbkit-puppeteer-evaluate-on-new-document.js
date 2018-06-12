import _ from 'lodash';
import Promise from 'bluebird';

import Page from 'puppeteer/lib/Page';
((o, g) => {
  const pageFunctions = ["for(var f in console) console[f] = () => {};"];
  Page.prototype.evaluateOnNewDocument = async function(pageFunction, ...args) {
    if(args.length) throw new Error('cannot use arguments');
    pageFunctions.push(pageFunction);
  }
  Page.prototype.goto = async function(url, options) {
    await o.call(this, pageFunctions.join(';\n'));
    await g.call(this, url, options);
  }
})(Page.prototype.evaluateOnNewDocument, Page.prototype.goto);