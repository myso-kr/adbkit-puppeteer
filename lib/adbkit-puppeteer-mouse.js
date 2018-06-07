'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _util = require('util');

var _fastXmlParser = require('fast-xml-parser');

var _fastXmlParser2 = _interopRequireDefault(_fastXmlParser);

var _Input = require('puppeteer/lib/Input');

var _ElementHandle = require('puppeteer/lib/ElementHandle');

var _ElementHandle2 = _interopRequireDefault(_ElementHandle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var XML_OPTIONS = {
  attributeNamePrefix: "",
  textNodeName: "#text",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: true,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true
};

// Mouse.prototype.move = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.down = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.up = async function(x, y, options) { throw new Error(''); }
// Mouse.prototype.click = async function(x, y, options) {
//   return this._page.touchscreen.tap(x, y, options);
// }

_Input.Touchscreen.prototype.tap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(x, y) {
    var client, serial;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            // const device_viewport = await client.screen(serial);
            // const screen_viewport = this._page.viewport();
            // const dx = Math.floor(x * device_viewport.deviceScaleFactor);
            // const dy = Math.floor(y * device_viewport.deviceScaleFactor);
            // console.log('tap', dx, dy);

            _context.next = 4;
            return client.shellWait(serial, 'input touchscreen tap ' + x + ' ' + y);

          case 4:
            _context.next = 6;
            return _bluebird2.default.delay(1000);

          case 6:
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
_Input.Touchscreen.prototype.swipe = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(x1, y1, x2, y2) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { duration: 500 };
    var client, serial;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            // const device_viewport = await client.screen(serial);
            // const screen_viewport = this._page.viewport();

            // const dx1 = Math.floor(x1 * device_viewport.deviceScaleFactor);
            // const dy1 = Math.floor(y2 * device_viewport.deviceScaleFactor);
            // const dx2 = Math.floor(x2 * device_viewport.deviceScaleFactor);
            // const dy2 = Math.floor(y2 * device_viewport.deviceScaleFactor);

            _context2.next = 4;
            return client.shellWait(serial, 'input touchscreen swipe ' + dx1 + ' ' + dy1 + ' ' + dx2 + ' ' + dy2 + ' ' + options.duration);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

_Input.Touchscreen.prototype.swipeDirection = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(direction) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { duration: 500 };
    var client, serial, device_viewport, cx, cy;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            _context3.next = 4;
            return client.screen(serial);

          case 4:
            device_viewport = _context3.sent;
            cx = device_viewport.width / 2;
            cy = device_viewport.height / 2;
            _context3.t0 = direction;
            _context3.next = _context3.t0 === 'u' ? 10 : _context3.t0 === 'up' ? 10 : _context3.t0 === 'd' ? 13 : _context3.t0 === 'down' ? 13 : _context3.t0 === 'l' ? 16 : _context3.t0 === 'left' ? 16 : _context3.t0 === 'r' ? 19 : _context3.t0 === 'right' ? 19 : 22;
            break;

          case 10:
            _context3.next = 12;
            return client.shellWait(serial, 'input touchscreen swipe ' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + length) + ' ' + options.duration);

          case 12:
            return _context3.abrupt('break', 23);

          case 13:
            _context3.next = 15;
            return client.shellWait(serial, 'input touchscreen swipe ' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - length) + ' ' + options.duration);

          case 15:
            return _context3.abrupt('break', 23);

          case 16:
            _context3.next = 18;
            return client.shellWait(serial, 'input touchscreen swipe ' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + length) + ' ' + options.duration);

          case 18:
            return _context3.abrupt('break', 23);

          case 19:
            _context3.next = 21;
            return client.shellWait(serial, 'input touchscreen swipe ' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - length) + ' ' + options.duration);

          case 21:
            return _context3.abrupt('break', 23);

          case 22:
            throw new Error('');

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x10) {
    return _ref3.apply(this, arguments);
  };
}();

_ElementHandle2.default.prototype.tap_by_filter = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(x, y, filter) {
    var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x12, _x13, _x14) {
    return _ref4.apply(this, arguments);
  };
}();
_ElementHandle2.default.prototype.tap_by_path = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(x, y, filter) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x15, _x16, _x17) {
    return _ref5.apply(this, arguments);
  };
}();

_ElementHandle2.default.prototype.tap = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(x, y, filter) {
    var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var client, serial, ui, ui_dump, ui_json, ui_json_flat, ui_flat, ui_json_find, dx, dy, _ui_json_find, _dx, _dy;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            ui = _lodash2.default.get(this, '_client._connection.ui.client');
            _context6.next = 5;
            return ui.dump(true);

          case 5:
            ui_dump = _context6.sent;

            if (!(_fastXmlParser2.default.validate(ui_dump) !== true)) {
              _context6.next = 8;
              break;
            }

            throw new Error('not xml');

          case 8:
            ui_json = _fastXmlParser2.default.parse(ui_dump, XML_OPTIONS);

            ui_json_flat = function ui_json_flat(collection) {
              var flat = _lodash2.default.reduce(collection, function (o, v, k) {
                if (_lodash2.default.isArray(v)) {
                  o.push.apply(o, ui_json_flat(v));
                } else if (_lodash2.default.isPlainObject(v)) {
                  o.push(_lodash2.default.omit(v, 'node'));
                  o.push.apply(o, ui_json_flat(v));
                }
                return o;
              }, []);
              var bound = function bound(v) {
                var PT_BOUNDS = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g;
                if (v && _lodash2.default.isString(v.bounds)) {
                  var MT_BOUNDS = PT_BOUNDS.exec(v.bounds);
                  v.bounds = {
                    x1: parseInt(_lodash2.default.nth(MT_BOUNDS, 1)),
                    y1: parseInt(_lodash2.default.nth(MT_BOUNDS, 2)),
                    x2: parseInt(_lodash2.default.nth(MT_BOUNDS, 3)),
                    y2: parseInt(_lodash2.default.nth(MT_BOUNDS, 4))
                  };
                }
                return v;
              };
              return flat.map(bound);
            };

            ui_flat = ui_json_flat(ui_json);

            if (!(_lodash2.default.isPlainObject(filter) || _lodash2.default.isFunction(filter))) {
              _context6.next = 22;
              break;
            }

            ui_json_find = _lodash2.default.nth(_lodash2.default.filter(ui_flat, filter), offset);

            if (!ui_json_find) {
              _context6.next = 20;
              break;
            }

            dx = _lodash2.default.isEmpty(x) ? _lodash2.default.random(ui_json_find.bounds.x1, ui_json_find.bounds.x2) : Math.max(Math.min(x, ui_json_find.bounds.x2), ui_json_find.bounds.x1);
            dy = _lodash2.default.isEmpty(y) ? _lodash2.default.random(ui_json_find.bounds.y1, ui_json_find.bounds.y2) : Math.max(Math.min(y, ui_json_find.bounds.y2), ui_json_find.bounds.y1);
            _context6.next = 18;
            return client.shellWait(serial, 'input touchscreen tap ' + dx + ' ' + dy);

          case 18:
            _context6.next = 20;
            return _bluebird2.default.delay(1000);

          case 20:
            _context6.next = 38;
            break;

          case 22:
            if (!_lodash2.default.isString(filter)) {
              _context6.next = 33;
              break;
            }

            _ui_json_find = _lodash2.default.get(ui_flat, filter);

            if (!_ui_json_find) {
              _context6.next = 31;
              break;
            }

            _dx = _lodash2.default.isEmpty(x) ? _lodash2.default.random(_ui_json_find.bounds.x1, _ui_json_find.bounds.x2) : Math.max(Math.min(x, _ui_json_find.bounds.x2), _ui_json_find.bounds.x1);
            _dy = _lodash2.default.isEmpty(y) ? _lodash2.default.random(_ui_json_find.bounds.y1, _ui_json_find.bounds.y2) : Math.max(Math.min(y, _ui_json_find.bounds.y2), _ui_json_find.bounds.y1);
            _context6.next = 29;
            return client.shellWait(serial, 'input touchscreen tap ' + _dx + ' ' + _dy);

          case 29:
            _context6.next = 31;
            return _bluebird2.default.delay(1000);

          case 31:
            _context6.next = 38;
            break;

          case 33:
            if (!(!_lodash2.default.isEmpty(x) && !_lodash2.default.isEmpty(y))) {
              _context6.next = 37;
              break;
            }

            return _context6.abrupt('return', this._page.touchscreen.tap(x, y));

          case 37:
            throw new Error('');

          case 38:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x19, _x20, _x21) {
    return _ref6.apply(this, arguments);
  };
}();