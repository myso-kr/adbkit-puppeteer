'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Launcher = require('puppeteer/lib/Launcher');

var _Launcher2 = _interopRequireDefault(_Launcher);

var _Input = require('puppeteer/lib/Input');

require('./adbkit-shell-wait');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_Launcher2.default.connect = function (o) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
      var client;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(options);
              _context.next = 3;
              return o.apply(this, [options]);

            case 3:
              client = _context.sent;

              _lodash2.default.set(client, '_connection.adb.client', _lodash2.default.get(options, 'adb'));
              _lodash2.default.set(client, '_connection.adb.serial', _lodash2.default.get(options, 'adbSerial'));
              return _context.abrupt('return', client);

            case 7:
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
  var KEYBOARD_PACKAGES = 'com.android.inputmethod.korean';
  var KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(text) {
      var client,
          serial,
          _len,
          args,
          _key,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              client = _lodash2.default.get(this, '_client._connection.adb.client');
              serial = _lodash2.default.get(this, '_client._connection.adb.serial');

              console.log(client, serial);
              _context2.t0 = !client || !serial;

              if (_context2.t0) {
                _context2.next = 8;
                break;
              }

              _context2.next = 7;
              return client.isInstalled(serial, KEYBOARD_PACKAGES);

            case 7:
              _context2.t0 = !_context2.sent;

            case 8:
              if (!_context2.t0) {
                _context2.next = 13;
                break;
              }

              for (_len = _args2.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args2[_key];
              }

              return _context2.abrupt('return', o.apply(this, [text].concat(_toConsumableArray(args))));

            case 13:
              _context2.next = 15;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 15:
              _context2.next = 17;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 17:
              text = text.replace(/(["\s'$`\\])/g, '\\$1');
              return _context2.abrupt('return', client.shellWait(serial, 'am broadcast -a ADB_INPUT_TEXT --es msg \'' + text + '\''));

            case 19:
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