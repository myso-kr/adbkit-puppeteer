'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Input = require('puppeteer/lib/Input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Keyboard.prototype.down   = () => { throw new Error(''); }
// Keyboard.prototype.up     = () => { throw new Error(''); }
// Keyboard.prototype.press  = () => { throw new Error(''); }
_Input.Keyboard.prototype.type = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  var KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(text) {
      var client, serial;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              client = _lodash2.default.get(this, '_client._connection.adb.client');
              serial = _lodash2.default.get(this, '_client._connection.adb.serial');

              if (!(!client || !serial)) {
                _context.next = 4;
                break;
              }

              throw new Error('');

            case 4:
              _context.next = 6;
              return client.isInstalled(serial, KEYBOARD_PACKAGES);

            case 6:
              if (_context.sent) {
                _context.next = 17;
                break;
              }

              _context.next = 9;
              return client.install(serial, _path2.default.join(__dirname, '../res/com.aosp.inputmethod.korean.apk'));

            case 9:
              _context.next = 11;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 11:
              _context.next = 13;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 13:
              _context.next = 15;
              return _bluebird2.default.delay(3000);

            case 15:
              _context.next = 21;
              break;

            case 17:
              _context.next = 19;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 19:
              _context.next = 21;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 21:
              _context.next = 23;
              return client.shellWait(serial, 'am broadcast -a ADB_INPUT_TEXT --es msg \'' + text.replace(/(["\s'$`\\])/g, '\\$1') + '\'');

            case 23:
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
}(_Input.Keyboard.prototype.type);