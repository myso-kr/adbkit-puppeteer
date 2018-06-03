'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _childProcessPromise = require('child-process-promise');

var _childProcessPromise2 = _interopRequireDefault(_childProcessPromise);

var _Launcher = require('puppeteer/lib/Launcher');

var _Launcher2 = _interopRequireDefault(_Launcher);

var _Browser = require('puppeteer/lib/Browser');

var _Browser2 = _interopRequireDefault(_Browser);

var _Input = require('puppeteer/lib/Input');

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _adbkit = require('adbkit');

var _adbkit2 = _interopRequireDefault(_adbkit);

var _client = require('adbkit/lib/adb/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Input.Keyboard.prototype.type = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(text) {
    var client, serial;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            return _context.abrupt('return', _childProcessPromise2.default.exec('adb -s ' + serial + ' shell am broadcast -a ADB_INPUT_TEXT --es msg \'' + text.replace(/(["\s'$`\\])/g, '\\$1').replace(/\n/g, '\\n') + '\''));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

_client2.default.prototype.shellWait = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var _args2 = arguments;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return this.shell.apply(this, _args2).then(_adbkit2.default.util.readAll);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

var PupeteerADB = function () {
  function PupeteerADB(client, serial, options) {
    _classCallCheck(this, PupeteerADB);

    this.CHROME_PACKAGES = 'com.android.chrome';
    this.CHROME_ACTIVITY = 'com.google.android.apps.chrome.Main';
    this.CHROME_PROTOCOL = 'localabstract:chrome_devtools_remote';
    this.REMOTE_KEYBOARD = 'com.android.inputmethod.korean/.SoftKeyboard';

    this.client = client;
    this.serial = serial;
    this.opts = _lodash2.default.defaultsDeep(options, { port: 9222, userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G935K Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36' });
  }

  _createClass(PupeteerADB, [{
    key: '__keyboard_install',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.client.isInstalled(this.serial, this.REMOTE_KEYBOARD);

              case 2:
                if (_context3.sent) {
                  _context3.next = 3;
                  break;
                }

              case 3:
                _context3.next = 5;
                return this.client.shell(this.serial, 'ime enable ' + this.REMOTE_KEYBOARD);

              case 5:
                _context3.next = 7;
                return this.client.shell(this.serial, 'ime set ' + this.REMOTE_KEYBOARD);

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function __keyboard_install() {
        return _ref3.apply(this, arguments);
      }

      return __keyboard_install;
    }()
  }, {
    key: '__chrome_install',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var forwards;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.client.isInstalled(this.serial, this.CHROME_PACKAGES);

              case 2:
                if (_context4.sent) {
                  _context4.next = 3;
                  break;
                }

              case 3:
                _context4.next = 5;
                return this.client.listForwards(this.serial);

              case 5:
                forwards = _context4.sent;

                if (_lodash2.default.find(forwards, { remote: this.CHROME_PROTOCOL })) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 9;
                return this.client.forward(this.serial, 'tcp:' + this.opts.port, this.CHROME_PROTOCOL);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function __chrome_install() {
        return _ref4.apply(this, arguments);
      }

      return __chrome_install;
    }()
  }, {
    key: '__chrome_start',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.client.shell(this.serial, 'echo "chrome --disable-fre --no-default-browser-check --no-first-run --user-agent=\'' + this.opts.userAgent + '\'" > /data/local/tmp/chrome-command-line');

              case 2:
                _context5.next = 4;
                return this.client.shell(this.serial, 'am set-debug-app --persistent ' + this.CHROME_PACKAGES);

              case 4:
                _context5.next = 6;
                return this.client.shell(this.serial, 'am start -n ' + this.CHROME_PACKAGES + '/' + this.CHROME_ACTIVITY + ' -d \'data:,\'');

              case 6:
                _context5.next = 8;
                return _bluebird2.default.delay(5000);

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function __chrome_start() {
        return _ref5.apply(this, arguments);
      }

      return __chrome_start;
    }()
  }, {
    key: '__chrome_stop',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.client.shell(this.serial, 'am force-stop ' + this.CHROME_PACKAGES);

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function __chrome_stop() {
        return _ref6.apply(this, arguments);
      }

      return __chrome_stop;
    }()
  }, {
    key: '__chrome_restart',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.__chrome_apps_stop();

              case 2:
                _context7.next = 4;
                return this.__chrome_apps_start();

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function __chrome_restart() {
        return _ref7.apply(this, arguments);
      }

      return __chrome_restart;
    }()
  }, {
    key: '__chrome_data_restore',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function __chrome_data_restore() {
        return _ref8.apply(this, arguments);
      }

      return __chrome_data_restore;
    }()
  }, {
    key: '__chrome_data_backup',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function __chrome_data_backup() {
        return _ref9.apply(this, arguments);
      }

      return __chrome_data_backup;
    }()
  }, {
    key: '__chrome_data_reset',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.client.shell(this.serial, 'pm clear ' + this.CHROME_PACKAGES);

              case 2:
                _context10.next = 4;
                return _bluebird2.default.delay(1000);

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function __chrome_data_reset() {
        return _ref10.apply(this, arguments);
      }

      return __chrome_data_reset;
    }()
  }, {
    key: '__chrome_connect',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        var _this = this;

        var connect_checker;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                connect_checker = function connect_checker() {
                  return new _bluebird2.default(function (resolve, reject) {
                    var socket = new _net2.default.Socket();
                    socket.on('error', reject);
                    socket.connect(_this.opts.port, '127.0.0.1', function () {
                      return resolve(socket.destroy());
                    });
                  }).delay(1000).catch(connect_checker);
                };

                return _context12.abrupt('return', connect_checker().then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                  var client;
                  return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          _context11.next = 2;
                          return _puppeteer2.default.connect({ browserWSEndpoint: 'ws://127.0.0.1:' + _this.opts.port + '/devtools/browser' });

                        case 2:
                          client = _context11.sent;

                          _lodash2.default.set(client, '_connection.adb.client', _this.client);
                          _lodash2.default.set(client, '_connection.adb.serial', _this.serial);
                          return _context11.abrupt('return', client);

                        case 6:
                        case 'end':
                          return _context11.stop();
                      }
                    }
                  }, _callee11, _this);
                }))).timeout(15000));

              case 2:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function __chrome_connect() {
        return _ref11.apply(this, arguments);
      }

      return __chrome_connect;
    }()
  }, {
    key: 'connect',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.__keyboard_install();

              case 2:
                _context13.next = 4;
                return this.__chrome_install();

              case 4:
                _context13.next = 6;
                return this.__chrome_data_reset();

              case 6:
                _context13.next = 8;
                return this.__chrome_start();

              case 8:
                return _context13.abrupt('return', this.__chrome_connect());

              case 9:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function connect() {
        return _ref13.apply(this, arguments);
      }

      return connect;
    }()
  }]);

  return PupeteerADB;
}();

_client2.default.prototype.puppeteer = function (serial, options, callback) {
  var _this2 = this;

  return this.connection().then(function (conn) {
    return new PupeteerADB(_this2, serial, options);
  }).nodeify(callback);
};