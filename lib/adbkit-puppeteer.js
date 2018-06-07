'use strict';

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _adbkit = require('adbkit');

var _adbkit2 = _interopRequireDefault(_adbkit);

require('./adbkit-shell-wait');

require('./adbkit-screen');

require('./adbkit-puppeteer-bridge');

require('./adbkit-puppeteer-keyboard');

require('./adbkit-puppeteer-mouse');

require('./adbkit-puppeteer-element');

var _client = require('adbkit/lib/adb/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = (0, _debug2.default)('adbkit-puppeteer');

_client2.default.prototype.puppeteer = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(serial, options) {
    var _this = this;

    var opts, CHROME_PACKAGES, CHROME_ACTIVITY, CHROME_PROTOCOL, forwards, chromeCommandLine, chrome;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            opts = _lodash2.default.defaultsDeep(options, {
              args: [],
              port: 9222,
              uiport: 9008,
              noReset: false,
              handler: {
                chrome_exit: function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            logger(serial, 'chrome_exit');

                          case 1:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  function chrome_exit() {
                    return _ref2.apply(this, arguments);
                  }

                  return chrome_exit;
                }(),
                chrome_clear: function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            logger(serial, 'chrome_clear');

                          case 1:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  }));

                  function chrome_clear() {
                    return _ref3.apply(this, arguments);
                  }

                  return chrome_clear;
                }(),
                chrome_connect: function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            logger(serial, 'chrome_connect');

                          case 1:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  function chrome_connect() {
                    return _ref4.apply(this, arguments);
                  }

                  return chrome_connect;
                }(),
                chrome_disconnect: function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            logger(serial, 'chrome_disconnect');

                          case 1:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, this);
                  }));

                  function chrome_disconnect() {
                    return _ref5.apply(this, arguments);
                  }

                  return chrome_disconnect;
                }(),
                chrome_preload: function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            logger(serial, 'chrome_preload');

                          case 1:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));

                  function chrome_preload() {
                    return _ref6.apply(this, arguments);
                  }

                  return chrome_preload;
                }(),
                chrome_load: function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            logger(serial, 'chrome_load');

                          case 1:
                          case 'end':
                            return _context6.stop();
                        }
                      }
                    }, _callee6, this);
                  }));

                  function chrome_load() {
                    return _ref7.apply(this, arguments);
                  }

                  return chrome_load;
                }(),
                chrome_ready: function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            logger(serial, 'chrome_ready');

                          case 1:
                          case 'end':
                            return _context7.stop();
                        }
                      }
                    }, _callee7, this);
                  }));

                  function chrome_ready() {
                    return _ref8.apply(this, arguments);
                  }

                  return chrome_ready;
                }()
              }
            });
            CHROME_PACKAGES = 'com.android.chrome';
            CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
            CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
            _context9.next = 6;
            return this.isInstalled(serial, CHROME_PACKAGES);

          case 6:
            if (_context9.sent) {
              _context9.next = 10;
              break;
            }

            throw new Error('chrome not found!');

          case 10:
            _context9.next = 12;
            return this.listForwards(serial);

          case 12:
            forwards = _context9.sent;

            if (_lodash2.default.find(forwards, { remote: CHROME_PROTOCOL })) {
              _context9.next = 16;
              break;
            }

            _context9.next = 16;
            return this.forward(serial, 'tcp:' + opts.port, CHROME_PROTOCOL);

          case 16:
            chromeCommandLine = [];

            chromeCommandLine.push('--disable-fre');
            chromeCommandLine.push('--no-default-browser-check');
            chromeCommandLine.push('--no-first-run');
            chromeCommandLine.push.apply(chromeCommandLine, opts.args);
            _context9.next = 23;
            return this.shellWait(serial, 'am force-stop ' + CHROME_PACKAGES);

          case 23:
            if (opts.noReset) {
              _context9.next = 28;
              break;
            }

            _context9.next = 26;
            return this.shellWait(serial, 'pm clear ' + CHROME_PACKAGES);

          case 26:
            _context9.next = 28;
            return opts.handler.chrome_clear();

          case 28:
            _context9.next = 30;
            return opts.handler.chrome_preload();

          case 30:
            _context9.next = 32;
            return this.shellWait(serial, 'echo "chrome ' + chromeCommandLine.join(' ') + '" > /data/local/tmp/chrome-command-line');

          case 32:
            _context9.next = 34;
            return this.shellWait(serial, 'am set-debug-app --persistent ' + CHROME_PACKAGES);

          case 34:
            _context9.next = 36;
            return this.shellWait(serial, 'am start -n ' + CHROME_PACKAGES + '/' + CHROME_ACTIVITY + ' -d \'data:,\'');

          case 36:
            _context9.next = 38;
            return _bluebird2.default.delay(5000);

          case 38:
            _context9.next = 40;
            return opts.handler.chrome_load();

          case 40:
            _context9.next = 42;
            return _puppeteer2.default.connect({
              adb: { client: this, serial: serial },
              ui: { port: opts.uiport, serial: serial, connectionTriesDelay: 3000, connectionMaxTries: 15 },
              browserWSEndpoint: 'ws://127.0.0.1:' + opts.port + '/devtools/browser'
            });

          case 42:
            chrome = _context9.sent;

            chrome.on('disconnected', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.next = 2;
                      return _this.shellWait(serial, 'am force-stop ' + CHROME_PACKAGES);

                    case 2:
                      _context8.next = 4;
                      return _this.shellWait(serial, 'rm -f /data/local/tmp/chrome-command-line');

                    case 4:
                      _context8.next = 6;
                      return opts.handler.chrome_disconnect(chrome);

                    case 6:
                    case 'end':
                      return _context8.stop();
                  }
                }
              }, _callee8, _this);
            })));
            _context9.next = 46;
            return opts.handler.chrome_ready(chrome);

          case 46:
            return _context9.abrupt('return', chrome);

          case 47:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();