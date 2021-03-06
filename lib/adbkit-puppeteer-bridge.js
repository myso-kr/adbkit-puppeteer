'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Launcher = require('puppeteer/lib/Launcher');

var _Launcher2 = _interopRequireDefault(_Launcher);

var _Browser = require('puppeteer/lib/Browser');

var _Browser2 = _interopRequireDefault(_Browser);

var _Page = require('puppeteer/lib/Page');

var _Page2 = _interopRequireDefault(_Page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Launcher2.default.connect = function (o) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
      var launcher, client, serial, ui;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return o.apply(this, [options]);

            case 2:
              launcher = _context.sent;
              client = _lodash2.default.get(options, 'adb.client');
              serial = _lodash2.default.get(options, 'adb.serial');

              _lodash2.default.set(launcher, '_connection.adb.client', client);
              _lodash2.default.set(launcher, '_connection.adb.serial', serial);

              _context.next = 9;
              return client.uiautomator(serial, _lodash2.default.get(options, 'ui'));

            case 9:
              ui = _context.sent;
              _context.next = 12;
              return ui.start(true);

            case 12:
              _lodash2.default.set(launcher, '_connection.ui.client', ui);
              _lodash2.default.set(launcher, '_connection.ui.serial', serial);
              launcher.on('disconnected', function () {
                return ui.stop(true);
              });

              return _context.abrupt('return', launcher);

            case 16:
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
}(_Launcher2.default.connect);

_Browser2.default.prototype.newPage = function (o) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var page;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return o.apply(this, args);

          case 2:
            page = _context2.sent;

            _lodash2.default.set(page, '_browser', this);
            console.log('Browser.newPage', page);
            return _context2.abrupt('return', page);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}(_Browser2.default.prototype.newPage);
_Browser2.default.prototype.pages = function (o) {
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _this = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var pages;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return o.apply(this, args);

          case 2:
            pages = _context3.sent;

            _lodash2.default.each(pages, function (page) {
              return _lodash2.default.set(page, '_browser', _this);
            });
            return _context3.abrupt('return', pages);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
}(_Browser2.default.prototype.pages);

Object.defineProperty(_Page2.default.prototype, 'keyboard', {
  get: function get() {
    _lodash2.default.set(this._keyboard, '_page', this);
    return this._keyboard;
  }
});
Object.defineProperty(_Page2.default.prototype, 'mouse', {
  get: function get() {
    _lodash2.default.set(this._mouse, '_page', this);
    return this._mouse;
  }
});
Object.defineProperty(_Page2.default.prototype, 'touchscreen', {
  get: function get() {
    _lodash2.default.set(this._touchscreen, '_page', this);
    return this._touchscreen;
  }
});