'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Browser = require('puppeteer/lib/Browser');

var _Browser2 = _interopRequireDefault(_Browser);

var _Input = require('puppeteer/lib/Input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Browser2.default.prototype.newPage = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var client, serial, page;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            _context.next = 4;
            return o.apply(this, args);

          case 4:
            page = _context.sent;
            _context.next = 7;
            return client.isInstalled(serial, KEYBOARD_PACKAGES);

          case 7:
            if (_context.sent) {
              _context.next = 14;
              break;
            }

            _context.next = 10;
            return client.install(serial, _path2.default.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));

          case 10:
            _context.next = 12;
            return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

          case 12:
            _context.next = 14;
            return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

          case 14:
            return _context.abrupt('return', page);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}(_Browser2.default.prototype.newPage);
_Browser2.default.prototype.pages = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var client, serial, pages;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = _lodash2.default.get(this, '_client._connection.adb.client');
            serial = _lodash2.default.get(this, '_client._connection.adb.serial');
            _context2.next = 4;
            return o.apply(this, args);

          case 4:
            pages = _context2.sent;
            _context2.next = 7;
            return client.isInstalled(serial, KEYBOARD_PACKAGES);

          case 7:
            if (_context2.sent) {
              _context2.next = 14;
              break;
            }

            _context2.next = 10;
            return client.install(serial, _path2.default.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));

          case 10:
            _context2.next = 12;
            return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

          case 12:
            _context2.next = 14;
            return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

          case 14:
            return _context2.abrupt('return', pages);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}(_Browser2.default.prototype.pages);

_Input.Keyboard.prototype.type = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  var KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(text) {
      var client, serial;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              client = _lodash2.default.get(this, '_client._connection.adb.client');
              serial = _lodash2.default.get(this, '_client._connection.adb.serial');

              if (!(!client || !serial)) {
                _context3.next = 4;
                break;
              }

              throw new Error('');

            case 4:
              _context3.next = 6;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 6:
              _context3.next = 8;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 8:
              _context3.next = 10;
              return client.shellWait(serial, 'am broadcast -a ADB_INPUT_TEXT --es msg \'' + text.replace(/(["\s'$`\\])/g, '\\$1') + '\'');

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
}(_Input.Keyboard.prototype.type);