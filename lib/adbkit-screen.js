'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _adbkit = require('adbkit');

var _adbkit2 = _interopRequireDefault(_adbkit);

var _client = require('adbkit/lib/adb/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_client2.default.prototype.screen = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(serial) {
    var PT_PHYSICAL_SIZE, PT_OVERRIDE_SIZE, PT_PHYSICAL_DENSITY, PT_OVERRIDE_DENSITY, s, d, MT_PHYSICAL_SIZE, MT_OVERRIDE_SIZE, MT_PHYSICAL_DENSITY, MT_OVERRIDE_DENSITY;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            PT_PHYSICAL_SIZE = /Physical size\: ([\d]+)x([\d]+)/ig;
            PT_OVERRIDE_SIZE = /Override size\: ([\d]+)x([\d]+)/ig;
            PT_PHYSICAL_DENSITY = /Physical density\: ([\d]+)/ig;
            PT_OVERRIDE_DENSITY = /Override density\: ([\d]+)/ig;
            _context.next = 6;
            return this.shellWait(serial, 'wm size');

          case 6:
            s = _context.sent.toString().trim();
            _context.next = 9;
            return this.shellWait(serial, 'wm density');

          case 9:
            d = _context.sent.toString().trim();
            MT_PHYSICAL_SIZE = PT_PHYSICAL_SIZE.exec(s);
            MT_OVERRIDE_SIZE = PT_OVERRIDE_SIZE.exec(s);
            MT_PHYSICAL_DENSITY = PT_PHYSICAL_DENSITY.exec(d);
            MT_OVERRIDE_DENSITY = PT_OVERRIDE_DENSITY.exec(d);
            return _context.abrupt('return', {
              width: parseInt(_lodash2.default.nth(MT_OVERRIDE_SIZE, 1) || _lodash2.default.nth(MT_PHYSICAL_SIZE, 1)),
              height: parseInt(_lodash2.default.nth(MT_OVERRIDE_SIZE, 2) || _lodash2.default.nth(MT_PHYSICAL_SIZE, 2)),
              realWidth: parseInt(_lodash2.default.nth(MT_PHYSICAL_SIZE, 1)),
              realHeight: parseInt(_lodash2.default.nth(MT_PHYSICAL_SIZE, 2)),
              deviceScaleFactor: parseInt(_lodash2.default.nth(MT_OVERRIDE_DENSITY, 1) || _lodash2.default.nth(MT_PHYSICAL_DENSITY, 1)) / 160
            });

          case 15:
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