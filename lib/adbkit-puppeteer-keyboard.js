'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Launcher = require('puppeteer/lib/Launcher');

var _Launcher2 = _interopRequireDefault(_Launcher);

var _Input = require('puppeteer/lib/Input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Launcher2.default.connect = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
      var launcher, client, serial;
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

              if (!(!client || !serial)) {
                _context.next = 7;
                break;
              }

              throw new Error('');

            case 7:
              _context.next = 9;
              return client.isInstalled(serial, KEYBOARD_PACKAGES);

            case 9:
              if (_context.sent) {
                _context.next = 16;
                break;
              }

              _context.next = 12;
              return client.install(serial, _path2.default.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));

            case 12:
              _context.next = 14;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 14:
              _context.next = 16;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 16:
              return _context.abrupt('return', launcher);

            case 17:
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

_Input.Keyboard.prototype.type = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  var KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(text) {
      var client, serial;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              client = _lodash2.default.get(this, '_client._connection.adb.client');
              serial = _lodash2.default.get(this, '_client._connection.adb.serial');

              if (!(!client || !serial)) {
                _context2.next = 4;
                break;
              }

              throw new Error('');

            case 4:
              _context2.next = 6;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 6:
              _context2.next = 8;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 8:
              _context2.next = 10;
              return client.shellWait(serial, 'am broadcast -a ADB_INPUT_TEXT --es msg \'' + text.replace(/(["\s'$`\\])/g, '\\$1') + '\'');

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
}(_Input.Keyboard.prototype.type);