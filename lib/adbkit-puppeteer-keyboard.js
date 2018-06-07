'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Input = require('puppeteer/lib/Input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Keyboard.prototype.down   = () => { throw new Error(''); }
// Keyboard.prototype.up     = () => { throw new Error(''); }
// Keyboard.prototype.press  = () => { throw new Error(''); }
_Input.Keyboard.prototype.type = function (o) {
  var KEYBOARD_PACKAGES = 'com.aosp.inputmethod.korean';
  var KEYBOARD_ACTIVITY = '.SoftKeyboard';
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(text) {
      var client,
          serial,
          _len,
          args,
          _key,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              client = _lodash2.default.get(this, '_client._connection.adb.client');
              serial = _lodash2.default.get(this, '_client._connection.adb.serial');
              _context.t0 = !client || !serial;

              if (_context.t0) {
                _context.next = 7;
                break;
              }

              _context.next = 6;
              return client.isInstalled(serial, KEYBOARD_PACKAGES);

            case 6:
              _context.t0 = !_context.sent;

            case 7:
              if (!_context.t0) {
                _context.next = 12;
                break;
              }

              for (_len = _args.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args[_key];
              }

              return _context.abrupt('return', o.apply(this, [text].concat(_toConsumableArray(args))));

            case 12:
              _context.next = 14;
              return client.shellWait(serial, 'ime enable ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 14:
              _context.next = 16;
              return client.shellWait(serial, 'ime set ' + KEYBOARD_PACKAGES + '/' + KEYBOARD_ACTIVITY);

            case 16:
              text = text.replace(/(["\s'$`\\])/g, '\\$1');
              return _context.abrupt('return', client.shellWait(serial, 'am broadcast -a ADB_INPUT_TEXT --es msg \'' + text + '\''));

            case 18:
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