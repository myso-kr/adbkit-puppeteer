'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _client = require('adbkit/lib/adb/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UIAutomatorServer = function () {
  function UIAutomatorServer(client, options) {
    _classCallCheck(this, UIAutomatorServer);

    this.options = _lodash2.default.defaultsDeep(options, {
      hostname: 'localhost',
      commadsExecutionDelay: 10,
      port: 9008,
      devicePort: 9008,
      connectionMaxTries: 5,
      connectionTriesDelay: 1000
    });
    this.client = client;
    this.serial = options.serial;
    this.url = _url2.default.format({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.url_json = _url2.default.resolve(this.url, '/jsonrpc/0');
    this.url_stop = _url2.default.resolve(this.url, '/stop');
    this.__counter = 0;
    this.__connectionTries = 0;
  }

  _createClass(UIAutomatorServer, [{
    key: 'connect',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keepApps) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.installAPK(keepApps);

              case 2:
                _context.next = 4;
                return this.startServer();

              case 4:
                _context.next = 6;
                return this.forwardAPK();

              case 6:
                _context.next = 8;
                return this.verify();

              case 8:
                return _context.abrupt('return', this);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect(_x) {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'disconnect',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(keepApps) {
        var client, serial;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                client = this.client;
                serial = this.serial;
                _context2.prev = 2;
                _context2.next = 5;
                return _requestPromise2.default.get(this.url_stop, {});

              case 5:
                _context2.next = 9;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](2);

              case 9:
                _context2.prev = 9;
                _context2.next = 12;
                return this.killServer();

              case 12:
                _context2.next = 14;
                return this.uninstallAPK(keepApps);

              case 14:
                return _context2.finish(9);

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 7, 9, 15]]);
      }));

      function disconnect(_x2) {
        return _ref2.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: 'send',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(method) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var props, resp;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.__counter = this.__counter + 1;
                props = { jsonrpc: '2.0', method: method, params: params, id: this._counter + "" };
                _context3.next = 4;
                return _bluebird2.default.delay(this.options.commadsExecutionDelay);

              case 4:
                _context3.next = 6;
                return _requestPromise2.default.post(this.url_json, { json: props });

              case 6:
                resp = _context3.sent;
                return _context3.abrupt('return', _lodash2.default.get(resp, 'result'));

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function send(_x4) {
        return _ref3.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'test',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var resp;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.send('ping');

              case 2:
                resp = _context4.sent;
                return _context4.abrupt('return', _lodash2.default.eq(resp, 'pong'));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function test() {
        return _ref4.apply(this, arguments);
      }

      return test;
    }()
  }, {
    key: 'verify',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var state;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _bluebird2.default.delay(this.options.connectionTriesDelay);

              case 2:
                _context5.next = 4;
                return this.test();

              case 4:
                state = _context5.sent;

                if (!state) {
                  _context5.next = 8;
                  break;
                }

                this.__connectionTries = 0;return _context5.abrupt('return', this);

              case 8:
                if (!(this.__connectionTries > this.options.connectionMaxTries)) {
                  _context5.next = 13;
                  break;
                }

                this.__connectionTries = 0;
                throw new Error('uiautomator-server: Failed to start json-prc server on device');

              case 13:
                this.__connectionTries += 1;
                return _context5.abrupt('return', this.verify());

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function verify() {
        return _ref5.apply(this, arguments);
      }

      return verify;
    }()
  }, {
    key: 'installAPK',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(keepApps) {
        var client, serial;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                client = this.client;
                serial = this.serial;
                _context6.t0 = !keepApps;

                if (_context6.t0) {
                  _context6.next = 7;
                  break;
                }

                _context6.next = 6;
                return client.isInstalled(serial, 'com.github.uiautomator');

              case 6:
                _context6.t0 = !_context6.sent;

              case 7:
                if (!_context6.t0) {
                  _context6.next = 10;
                  break;
                }

                _context6.next = 10;
                return client.install(serial, _path2.default.resolve(__dirname, '../res/com.github.uiautomator.apk'));

              case 10:
                _context6.t1 = !keepApps;

                if (_context6.t1) {
                  _context6.next = 15;
                  break;
                }

                _context6.next = 14;
                return client.isInstalled(serial, 'com.github.uiautomator.test');

              case 14:
                _context6.t1 = !_context6.sent;

              case 15:
                if (!_context6.t1) {
                  _context6.next = 18;
                  break;
                }

                _context6.next = 18;
                return client.install(serial, _path2.default.resolve(__dirname, '../res/com.github.uiautomator.test.apk'));

              case 18:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function installAPK(_x5) {
        return _ref6.apply(this, arguments);
      }

      return installAPK;
    }()
  }, {
    key: 'uninstallAPK',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(keepApps) {
        var client, serial;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                client = this.client;
                serial = this.serial;
                _context7.t0 = !keepApps;

                if (!_context7.t0) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 6;
                return client.isInstalled(serial, 'com.github.uiautomator');

              case 6:
                _context7.t0 = _context7.sent;

              case 7:
                if (!_context7.t0) {
                  _context7.next = 10;
                  break;
                }

                _context7.next = 10;
                return client.uninstall(serial, 'com.github.uiautomator');

              case 10:
                _context7.t1 = !keepApps;

                if (!_context7.t1) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 14;
                return client.isInstalled(serial, 'com.github.uiautomator.test');

              case 14:
                _context7.t1 = _context7.sent;

              case 15:
                if (!_context7.t1) {
                  _context7.next = 18;
                  break;
                }

                _context7.next = 18;
                return client.uninstall(serial, 'com.github.uiautomator.test');

              case 18:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function uninstallAPK(_x6) {
        return _ref7.apply(this, arguments);
      }

      return uninstallAPK;
    }()
  }, {
    key: 'forwardAPK',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var client, serial;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                client = this.client;
                serial = this.serial;
                _context8.next = 4;
                return client.forward(serial, 'tcp:' + this.options.port, 'tcp:' + this.options.devicePort);

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function forwardAPK() {
        return _ref8.apply(this, arguments);
      }

      return forwardAPK;
    }()
  }, {
    key: 'startServer',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var serial;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                serial = this.serial;

                this.handler = _child_process2.default.spawn('adb', ['-s', serial, 'shell', 'am', 'instrument', '-w', 'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner']);

              case 2:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function startServer() {
        return _ref9.apply(this, arguments);
      }

      return startServer;
    }()
  }, {
    key: 'killServer',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (this.handler) {
                  _context10.next = 2;
                  break;
                }

                return _context10.abrupt('return');

              case 2:
                this.handler.stdin.pause();
                this.handler.kill();

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function killServer() {
        return _ref10.apply(this, arguments);
      }

      return killServer;
    }()
  }]);

  return UIAutomatorServer;
}();

var UIAutomatorSelector = function UIAutomatorSelector(fields) {
  _classCallCheck(this, UIAutomatorSelector);

  var masks = {
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
  for (var field in fields) {
    var value = fields[field];
    if (value) {
      this.mask = this.mask | masks[field];
    }
    if (field === 'childOrSiblingSelector') {
      this[field] = new UIAutomatorSelector(fields[field]);
    }
    this[field] = value;
  }
};

var UIAutomator = function () {
  function UIAutomator(client, options) {
    _classCallCheck(this, UIAutomator);

    var pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left', 'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'];
    var aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings', 'isScreenOn'];
    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    this._server = new UIAutomatorServer(client, options);
  }

  _createClass(UIAutomator, [{
    key: 'start',
    value: function start(keepApks) {
      return this._server.connect(keepApks);
    }
  }, {
    key: 'stop',
    value: function stop(keepApks) {
      return this._server.disconnect(keepApks);
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this._server.test();
    }
  }, {
    key: 'click',
    value: function click(selector, cb) {
      var preparedSelector = new UIAutomatorSelector(selector);
      return this._server.send('click', [preparedSelector]);
    }
  }, {
    key: 'info',
    value: function info() {
      return this._server.send('deviceInfo', []);
    }
  }, {
    key: 'dump',
    value: function dump(compressed) {
      return this._server.send('dumpWindowHierarchy', [compressed]);
    }
  }, {
    key: 'screenshot',
    value: function screenshot(filename, scale, quality) {
      return this._server.send('takeScreenshot', [filename, scale, quality]);
    }
  }, {
    key: '_register',
    value: function _register(methods, prefix) {
      var _this = this;

      var _loop = function _loop(method) {
        var decamelizedMethodName = _lodash2.default.snakeCase(method);
        if (prefix) {
          _this[method] = function () {
            return _this._server.send(prefix, [decamelizedMethodName]);
          };
        } else {
          _this[method] = function () {
            return _this._server.send(method, []);
          };
        }
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;

          _loop(method);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return UIAutomator;
}();

_client2.default.prototype.uiautomator = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(serial, options) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt('return', this.__ui = this.__ui || new UIAutomator(this, _lodash2.default.assign({ serial: serial }, options)));

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function (_x7, _x8) {
    return _ref11.apply(this, arguments);
  };
}();