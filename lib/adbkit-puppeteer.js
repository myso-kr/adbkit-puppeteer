'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _adbkit = require('adbkit');

var _adbkit2 = _interopRequireDefault(_adbkit);

var _client = require('adbkit/lib/adb/client');

var _client2 = _interopRequireDefault(_client);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

require('./adbkit-backup');

require('./adbkit-puppeteer-keyboard');

require('./adbkit-puppeteer-mouse');

require('./adbkit-puppeteer-element');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_client2.default.prototype.puppeteer = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(serial, options) {
    var opts, CHROME_PACKAGES, CHROME_ACTIVITY, CHROME_PROTOCOL, forwards, chromeCommandLine, chrome;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = _lodash2.default.defaultsDeep(options, {
              port: 9222,
              noReset: false,
              args: []
            });
            CHROME_PACKAGES = 'com.android.chrome';
            CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
            CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
            _context.next = 6;
            return this.isInstalled(serial, CHROME_PACKAGES);

          case 6:
            if (_context.sent) {
              _context.next = 10;
              break;
            }

            throw new Error('chrome not found!');

          case 10:
            _context.next = 12;
            return this.listForwards(serial);

          case 12:
            forwards = _context.sent;

            if (_lodash2.default.find(forwards, { remote: CHROME_PROTOCOL })) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return this.forward(serial, 'tcp:' + opts.port, CHROME_PROTOCOL);

          case 16:
            chromeCommandLine = [];

            chromeCommandLine.push('--disable-fre');
            chromeCommandLine.push('--no-default-browser-check');
            chromeCommandLine.push('--no-first-run');
            chromeCommandLine.push.apply(chromeCommandLine, opts.args);

            if (opts.noReset) {
              _context.next = 26;
              break;
            }

            _context.next = 24;
            return this.shellWait(serial, 'am force-stop ' + CHROME_PACKAGES);

          case 24:
            _context.next = 26;
            return this.shellWait(serial, 'pm clear ' + CHROME_PACKAGES);

          case 26:
            _context.next = 28;
            return this.shellWait(serial, 'echo "chrome ' + chromeCommandLine.join(' ') + '" > /data/local/tmp/chrome-command-line');

          case 28:
            _context.next = 30;
            return this.shellWait(serial, 'am set-debug-app --persistent ' + CHROME_PACKAGES);

          case 30:
            _context.next = 32;
            return this.shellWait(serial, 'am start -n ' + CHROME_PACKAGES + '/' + CHROME_ACTIVITY + ' -d \'data:,\'');

          case 32:
            _context.next = 34;
            return _bluebird2.default.delay(5000);

          case 34:
            chrome = _puppeteer2.default.connect({
              adb: this, adbSerial: serial,
              browserWSEndpoint: 'ws://127.0.0.1:' + opts.port + '/devtools/browser'
            });
            return _context.abrupt('return', chrome);

          case 36:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();