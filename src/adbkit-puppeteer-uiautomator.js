import _ from 'lodash';
import Promise from 'bluebird';

import URL from 'url';
import Path from 'path';

import Request from 'request-promise';

class UIAutomatorServer {
  constructor(client, options) {
    this.options = _.defaultsDeep(options, {
      hostname: 'localhost',
      commadsExecutionDelay: 10,
      port: 9008,
      devicePort: 9008,
      connectionMaxTries: 5,
      connectionTriesDelay: 1000,
    });
    this.client = client;
    this.serial = options.serial;
    this.url = URL.format({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.url_json = URL.resolve(this.url, '/jsonrpc/0');
    this.url_stop = URL.resolve(this.url, '/stop');
    this.__counter = 0;
    this.__connectionTries = 0;
  }

  async connect(keepApps) {
    await this.installAPK(keepApps);
    await this.startAPK();
    await this.forwardAPK();
    await this.verify();
    return this;
  }

  async disconnect(keepApps) {
    const client = this.client;
    const serial = this.serial;
    try {
      const resp = await Request({ method: 'GET', uri: this.url_stop, json: true });
      console.log(resp);
      await this.uninstallAPK(keepApps);
    } catch(e) {
      throw new Error(`uiautomator-server: Failed to stop uiautomator json-prc server on device ${e.message || e}`);
    }
  }

  async send(method, params = []) {
    this.__counter = this.__counter + 1;
    const props = { jsonrpc: '2.0', method, params, id: this._counter };
    await Promise.delay(this.options.commadsExecutionDelay);
    const resp = await Request({ method: 'POST', uri: this.url_json, body: props, json: true });
    console.log(resp);
    return resp;
  }

  async test() {
    const resp = await this.send('ping');
    return _.eq(resp && resp.result, 'pong');
  }

  async verify() {
    await Promise.delay(this.options.connectionTriesDelay);
    const state = await this.test();
    if(state) { this.__connectionTries = 0; return this; }
    if (this.__connectionTries > this.options.connectionMaxTries) {
      this.__connectionTries = 0;
      throw new Error(`uiautomator-server: Failed to start json-prc server on device`);
    } else {
      this.__connectionTries += 1;
      return this.verify();
    }
  }

  async installAPK(keepApps) {
    const client = this.client;
    const serial = this.serial;
    if(!keepApps || !(await client.isInstalled(serial, 'com.github.uiautomator'))) {
      await client.install(serial, Path.resolve(__dirname, '../src/com.github.uiautomator.apk'));
    }
    if(!keepApps || !(await client.isInstalled(serial, 'com.github.uiautomator.test'))) {
      await client.install(serial, Path.resolve(__dirname, '../src/com.github.uiautomator.test.apk'));
    }
  }

  async uninstallAPK(keepApps) {
    const client = this.client;
    const serial = this.serial;
    if(!keepApps && await client.isInstalled(serial, 'com.github.uiautomator')) {
      await client.uninstall(serial, 'com.github.uiautomator');
    }
    if(!keepApps && await client.isInstalled(serial, 'com.github.uiautomator.test')) {
      await client.uninstall(serial, 'com.github.uiautomator.test');
    }
  }

  async forwardAPK() {
    const client = this.client;
    const serial = this.serial;
    await client.forward(serial, `tcp:${this.options.port}`, `tcp:${this.options.devicePort}`);
  }

  async startAPK() {
    const client = this.client;
    const serial = this.serial;
    await client.shell(serial, `am instrument -w com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner`);
  }
}

class UIAutomatorSelector {
  constructor(fields) {
    const masks = {
      text: 0x01,
      textContains: 0x02,
      textMatches: 0x04,
      textStartsWith: 0x08,
      className: 0x10,
      classNameMatches: 0x20,
      description: 0x40,
      descriptionContains: 0x80,
      descriptionMatches: 0x0100,
      descriptionStartsWith: 0x0200,
      checkable: 0x0400,
      checked: 0x0800,
      clickable: 0x1000,
      longClickable: 0x2000,
      scrollable: 0x4000,
      enabled: 0x8000,
      focusable: 0x010000,
      focused: 0x020000,
      selected: 0x040000,
      packageName: 0x080000,
      packageNameMatches: 0x100000,
      resourceId: 0x200000,
      resourceIdMatches: 0x400000,
      index: 0x800000,
      instance: 0x01000000
    };

    this.mask = 0;
    for (const field in fields) {
      const value = fields[field];
      if (value) {
        this.mask = this.mask | masks[field];
      }
      if (field === 'childOrSiblingSelector') {
        this[field] = new UIAutomatorSelector(fields[field]);
      }
      this[field] = value;
    }
  }
}

class UIAutomator {
  constructor(client, options) {
    const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left', 'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'];
    const aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings', 'isScreenOn'];
    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    this._server = new UIAutomatorServer(client, options);
  }

  start (keepApks) {
    return this._server.connect(keepApks);
  }

  stop (keepApks) {
    return this._server.disconnect(keepApks);
  }

  isConnected () {
    return this._server.test();
  }

  click (selector, cb) {
    const preparedSelector = new UIAutomatorSelector(selector);
    return this._server.send('click', [preparedSelector]);
  }

  info () {
    return this._server.send('deviceInfo', []);
  }

  dump (compressed) {
    return this._server.send('dumpWindowHierarchy', [compressed]);
  }

  screenshot (filename, scale, quality) {
    return this._server.send('takeScreenshot', [filename, scale, quality]);
  }

  _register(methods, prefix) {
    for (const method of methods) {
      const decamelizedMethodName = _.snakeCase(method);
      if (prefix) {
        this[method] = () => this._server.send(prefix, [decamelizedMethodName]);
      } else {
        this[method] = () => this._server.send(method, []);
      }
    }
  }
}

import Client from 'adbkit/lib/adb/client';
Client.prototype.uiautomator = async function(serial, options) {
  return this.__ui = this.__ui || new UIAutomator(this, _.assign({ serial }, options));
}