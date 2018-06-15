'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _devices = require('../devices');

var _devices2 = _interopRequireDefault(_devices);

var _Page = require('puppeteer/lib/Page');

var _Page2 = _interopRequireDefault(_Page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Page2.default.prototype.setViewport = function (o) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var device, client, serial, deviceSettings, defines;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            device = _lodash2.default.get(_devices2.default, _lodash2.default.get(opts, 'modelName'));

            if (!device) {
              _context2.next = 11;
              break;
            }

            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            deviceSettings = _lodash2.default.map(device, function (v, k) {
              return { key: k, value: v };
            });
            _context2.next = 7;
            return _bluebird2.default.map(deviceSettings, function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(setting) {
                var attrPath, attrName, attrType, attrValue;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(setting.key == 'window.navigator.userAgent')) {
                          _context.next = 3;
                          break;
                        }

                        _context.next = 3;
                        return _this.setUserAgent(setting.value);

                      case 3:
                        if (setting.key == 'window.innerWidth') {
                          _lodash2.default.set(opts, 'width', setting.value);
                        }
                        if (setting.key == 'window.outerHeight') {
                          _lodash2.default.set(opts, 'height', setting.value);
                        }
                        if (setting.key == 'window.devicePixelRatio') {
                          _lodash2.default.set(opts, 'deviceScaleFactor', setting.value);
                        }
                        if (setting.key == 'window.navigator.platform' && setting.value.indexOf(setting.key, 'arm') != -1) {
                          _lodash2.default.set(opts, 'isMobile', true);
                          _lodash2.default.set(opts, 'hasTouch', true);
                        }
                        attrPath = setting.key.split('.');
                        attrName = _lodash2.default.join(_lodash2.default.dropRight(attrPath), '.');
                        attrType = _lodash2.default.nth(attrPath, -1);
                        attrValue = _lodash2.default.isString(setting.value) ? '"' + setting.value + '"' : setting.value;
                        return _context.abrupt('return', 'Object.defineProperty(' + attrName + ', "' + attrType + '", { get: function() { return ' + attrValue + '; }, set: function(v) {} });');

                      case 12:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 7:
            defines = _context2.sent;

            console.log(opts, defines.join('\n'));
            _context2.next = 11;
            return this.evaluateOnNewDocument(defines.join('\n'));

          case 11:
            _lodash2.default.unset(opts, 'modelName');
            return _context2.abrupt('return', o.apply(this, [opts]));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}(_Page2.default.prototype.setViewport);