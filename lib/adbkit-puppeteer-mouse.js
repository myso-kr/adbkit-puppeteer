'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ElementHandle = require('puppeteer/lib/ElementHandle');

var _ElementHandle2 = _interopRequireDefault(_ElementHandle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_ElementHandle2.default.prototype.click = function (o) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rect, size, centerX, centerY, lt, rb;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(_lodash2.default.has(options, 'x') && _lodash2.default.has(options, 'y'))) {
              _context.next = 25;
              break;
            }

            _context.next = 3;
            return this._scrollIntoViewIfNeeded();

          case 3:
            _context.next = 5;
            return this.boundingBox();

          case 5:
            rect = _context.sent;
            _context.next = 8;
            return this.boxModel();

          case 8:
            size = _context.sent;
            centerX = rect.x + rect.width / 2;
            centerY = rect.y + rect.height / 2;
            lt = {
              x: Math.max(size.content[0].x, size.padding[0].x, size.border[0].x, size.margin[0].x),
              y: Math.max(size.content[0].y, size.padding[0].y, size.border[0].y, size.margin[0].y)
            };
            rb = {
              x: Math.min(size.content[2].x, size.padding[2].x, size.border[2].x, size.margin[2].x),
              y: Math.min(size.content[2].y, size.padding[2].y, size.border[2].y, size.margin[2].y)
            };

            if (options.x === true) options.x = _lodash2.default.random(lt.x + 1, rb.x - 1);
            if (options.x === undefined) options.x = centerX;
            if (options.x <= lt.x) options.x = lt.x + 1;
            if (options.x >= rb.x) options.x = rb.x - 1;
            if (options.y === true) options.y = _lodash2.default.random(lt.y + 1, rb.y - 1);
            if (options.y === undefined) options.y = centerY;
            if (options.y <= lt.y) options.y = lt.y + 1;
            if (options.y >= rb.y) options.y = rb.y - 1;
            _context.next = 23;
            return this._page.mouse.click(options.x, options.y, _lodash2.default.omit(options, 'x', 'y'));

          case 23:
            _context.next = 26;
            break;

          case 25:
            return _context.abrupt('return', o.apply(this, [options]));

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}(_ElementHandle2.default.prototype.click);

_ElementHandle2.default.prototype.tap = function (o) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rect, size, centerX, centerY, lt, rb;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(_lodash2.default.has(options, 'x') && _lodash2.default.has(options, 'y'))) {
              _context2.next = 25;
              break;
            }

            _context2.next = 3;
            return this._scrollIntoViewIfNeeded();

          case 3:
            _context2.next = 5;
            return this.boundingBox();

          case 5:
            rect = _context2.sent;
            _context2.next = 8;
            return this.boxModel();

          case 8:
            size = _context2.sent;
            centerX = rect.x + rect.width / 2;
            centerY = rect.y + rect.height / 2;
            lt = {
              x: Math.max(size.content[0].x, size.padding[0].x, size.border[0].x, size.margin[0].x),
              y: Math.max(size.content[0].y, size.padding[0].y, size.border[0].y, size.margin[0].y)
            };
            rb = {
              x: Math.min(size.content[2].x, size.padding[2].x, size.border[2].x, size.margin[2].x),
              y: Math.min(size.content[2].y, size.padding[2].y, size.border[2].y, size.margin[2].y)
            };

            if (options.x === true) options.x = _lodash2.default.random(lt.x + 1, rb.x - 1);
            if (options.x === undefined) options.x = centerX;
            if (options.x <= lt.x) options.x = lt.x + 1;
            if (options.x >= rb.x) options.x = rb.x - 1;
            if (options.y === true) options.y = _lodash2.default.random(lt.y + 1, rb.y - 1);
            if (options.y === undefined) options.y = centerY;
            if (options.y <= lt.y) options.y = lt.y + 1;
            if (options.y >= rb.y) options.y = rb.y - 1;
            _context2.next = 23;
            return this._page.touchscreen.tap(options.x, options.y);

          case 23:
            _context2.next = 26;
            break;

          case 25:
            return _context2.abrupt('return', o.apply(this, [options]));

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}(_ElementHandle2.default.prototype.tap);