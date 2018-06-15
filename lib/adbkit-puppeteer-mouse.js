'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('./lodash-filter-deep');

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

_Input.Touchscreen.prototype.tap = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(x, y) {
    var client, serial, ui, device_viewport, screen_viewport, ui_dump, ui_view, ui_bnds, ui_rect, dx, dy;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            ui = _lodash2.default.get(this, '_client._connection.ui.client');
            _context.next = 5;
            return client.screen(serial);

          case 5:
            device_viewport = _context.sent;
            screen_viewport = this._page.viewport();
            _context.next = 9;
            return ui.dump(true);

          case 9:
            ui_dump = _context.sent;
            ui_view = _lodash2.default.findDeep(_fastXmlParser2.default.parse(ui_dump, XML_OPTIONS), { class: "android.webkit.WebView" });

            if (!ui_view) {
              _context.next = 26;
              break;
            }

            ui_bnds = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g.exec(ui_view.bounds);
            ui_rect = _lodash2.default.zipObject(['x1', 'y1', 'x2', 'y2'], [parseInt(ui_bnds[1]), parseInt(ui_bnds[2]), parseInt(ui_bnds[3]), parseInt(ui_bnds[4])]);
            dx = Math.floor(x * device_viewport.deviceScaleFactor);
            dy = Math.floor(y * device_viewport.deviceScaleFactor);


            dx = dx + ui_rect.x1;
            dy = dy + ui_rect.y1;

            dx = Math.min(Math.max(dx, ui_rect.x1), ui_rect.x2);
            dy = Math.min(Math.max(dy, ui_rect.y1), ui_rect.y2);

            _context.next = 22;
            return client.shellWait(serial, 'input touchscreen tap ' + dx + ' ' + dy);

          case 22:
            _context.next = 24;
            return _bluebird2.default.delay(1000);

          case 24:
            _context.next = 30;
            break;

          case 26:
            _context.next = 28;
            return _bluebird2.default.delay(1000);

          case 28:
            _context.next = 30;
            return this.tap(x, y);

          case 30:
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
    var client, serial, ui, device_viewport, screen_viewport, ui_dump, ui_view, ui_bnds, ui_rect, dx1, dy1, dx2, dy2;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            ui = _lodash2.default.get(this, '_client._connection.ui.client');
            _context2.next = 5;
            return client.screen(serial);

          case 5:
            device_viewport = _context2.sent;
            screen_viewport = this._page.viewport();
            _context2.next = 9;
            return ui.dump(true);

          case 9:
            ui_dump = _context2.sent;
            ui_view = _lodash2.default.findDeep(_fastXmlParser2.default.parse(ui_dump, XML_OPTIONS), { class: "android.webkit.WebView" });

            if (!ui_view) {
              _context2.next = 32;
              break;
            }

            ui_bnds = /\[([\d]+),([\d]+)\]\[([\d]+),([\d]+)\]/g.exec(ui_view.bounds);
            ui_rect = _lodash2.default.zipObject(['x1', 'y1', 'x2', 'y2'], [parseInt(ui_bnds[1]), parseInt(ui_bnds[2]), parseInt(ui_bnds[3]), parseInt(ui_bnds[4])]);
            dx1 = Math.floor(x1 * device_viewport.deviceScaleFactor);
            dy1 = Math.floor(y1 * device_viewport.deviceScaleFactor);
            dx2 = Math.floor(x2 * device_viewport.deviceScaleFactor);
            dy2 = Math.floor(y2 * device_viewport.deviceScaleFactor);


            dx1 = dx1 + ui_rect.x1;
            dy1 = dy1 + ui_rect.y1;
            dx2 = dx2 + ui_rect.x1;
            dy2 = dy2 + ui_rect.y1;

            dx1 = Math.min(Math.max(dx1, ui_rect.x1), ui_rect.x2);
            dy1 = Math.min(Math.max(dy1, ui_rect.y1), ui_rect.y2);
            dx2 = Math.min(Math.max(dx2, ui_rect.x1), ui_rect.x2);
            dy2 = Math.min(Math.max(dy2, ui_rect.y1), ui_rect.y2);

            _context2.next = 28;
            return client.shellWait(serial, 'input touchscreen swipe ' + dx1 + ' ' + dy1 + ' ' + dx2 + ' ' + dy2 + ' ' + options.duration);

          case 28:
            _context2.next = 30;
            return _bluebird2.default.delay(1000);

          case 30:
            _context2.next = 36;
            break;

          case 32:
            _context2.next = 34;
            return _bluebird2.default.delay(1000);

          case 34:
            _context2.next = 36;
            return this.swipe(x1, y1, x2, y2, options);

          case 36:
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
    var client, serial, screen_viewport, cx, cy;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            screen_viewport = this._page.viewport();
            cx = screen_viewport.width / 2;
            cy = screen_viewport.height / 2;
            _context3.t0 = direction;
            _context3.next = _context3.t0 === 'u' ? 8 : _context3.t0 === 'up' ? 8 : _context3.t0 === 'd' ? 11 : _context3.t0 === 'down' ? 11 : _context3.t0 === 'l' ? 14 : _context3.t0 === 'left' ? 14 : _context3.t0 === 'r' ? 17 : _context3.t0 === 'right' ? 17 : 20;
            break;

          case 8:
            _context3.next = 10;
            return this.swipe(cx, cy, cx, cy + length, options);

          case 10:
            return _context3.abrupt('break', 20);

          case 11:
            _context3.next = 13;
            return this.swipe(cx, cy, cx, cy - length, options);

          case 13:
            return _context3.abrupt('break', 20);

          case 14:
            _context3.next = 16;
            return this.swipe(cx, cy, cx + length, cy, options);

          case 16:
            return _context3.abrupt('break', 20);

          case 17:
            _context3.next = 19;
            return this.swipe(cx, cy, cx - length, cy, options);

          case 19:
            return _context3.abrupt('break', 20);

          case 20:
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

_ElementHandle2.default.prototype.tap = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(x, y) {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', _bluebird2.default.resolve().then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
              var client, serial, ui, screen_viewport, el_hide, el_rect;
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      client = _lodash2.default.get(_this, '_client._connection.adb.client');
                      serial = _lodash2.default.get(_this, '_client._connection.adb.serial');
                      ui = _lodash2.default.get(_this, '_client._connection.ui.client');
                      screen_viewport = _this._page.viewport();
                      _context4.next = 6;
                      return _this.executionContext().evaluate(function (el) {
                        if (!el.isConnected) return 'Node is detached from document';
                        if (el.nodeType !== Node.ELEMENT_NODE) return 'Node is not of type HTMLElement';
                        var bounding = el.getBoundingClientRect();
                        var boundingT = bounding.top >= 0;
                        var boundingL = bounding.left >= 0;
                        var boundingB = bounding.bottom <= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                        var boundingR = bounding.right <= Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                        if (!boundingT) return 'boundingT';
                        if (!boundingL) return 'boundingL';
                        if (!boundingB) return 'boundingB';
                        if (!boundingR) return 'boundingR';
                        return false;
                      }, _this);

                    case 6:
                      el_hide = _context4.sent;

                      if (!el_hide) {
                        _context4.next = 28;
                        break;
                      }

                      _context4.t0 = el_hide;
                      _context4.next = _context4.t0 === 'boundingT' ? 11 : _context4.t0 === 'boundingL' ? 15 : _context4.t0 === 'boundingB' ? 19 : _context4.t0 === 'boundingR' ? 23 : 27;
                      break;

                    case 11:
                      _context4.next = 13;
                      return _this._page.touchscreen.swipeDirection('u', screen_viewport.height / 2);

                    case 13:
                      return _context4.abrupt('return', _this.tap(x, y));

                    case 15:
                      _context4.next = 17;
                      return _this._page.touchscreen.swipeDirection('r', screen_viewport.width / 2);

                    case 17:
                      return _context4.abrupt('return', _this.tap(x, y));

                    case 19:
                      _context4.next = 21;
                      return _this._page.touchscreen.swipeDirection('d', screen_viewport.height / 2);

                    case 21:
                      return _context4.abrupt('return', _this.tap(x, y));

                    case 23:
                      _context4.next = 25;
                      return _this._page.touchscreen.swipeDirection('l', screen_viewport.width / 2);

                    case 25:
                      return _context4.abrupt('return', _this.tap(x, y));

                    case 27:
                      throw new Error(el_hide);

                    case 28:
                      _context4.next = 30;
                      return _this.boxModel();

                    case 30:
                      el_rect = _context4.sent;

                      x = _lodash2.default.isEmpty(x) ? _lodash2.default.random(el_rect.padding[0].x, el_rect.padding[2].x) : x + el_rect.padding[0].x;
                      y = _lodash2.default.isEmpty(y) ? _lodash2.default.random(el_rect.padding[0].y, el_rect.padding[2].y) : y + el_rect.padding[0].y;
                      x = Math.min(Math.max(x, el_rect.padding[0].x), el_rect.padding[0].x);
                      y = Math.min(Math.max(y, el_rect.padding[0].y), el_rect.padding[2].y);
                      _context4.next = 37;
                      return _this._page.touchscreen.tap(x, y);

                    case 37:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, _this);
            }))).timeout(60000));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();