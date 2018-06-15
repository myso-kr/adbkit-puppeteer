'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Page = require('puppeteer/lib/Page');

var _Page2 = _interopRequireDefault(_Page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function (o, g) {
  _Page2.default.prototype.evaluateOnNewDocument = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pageFunction) {
      var _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.pageFunctions = this.pageFunctions || ["for(var f in console) console[f] = () => {};"];

              if (!(_args.length <= 1 ? 0 : _args.length - 1)) {
                _context.next = 3;
                break;
              }

              throw new Error('cannot use arguments');

            case 3:
              this.pageFunctions.push(pageFunction);

            case 4:
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
  _Page2.default.prototype.goto = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, options) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.pageFunctions = this.pageFunctions || ["for(var f in console) console[f] = () => {};"];
              _context2.next = 3;
              return o.apply(this, [this.pageFunctions.join(';\n')]);

            case 3:
              _context2.next = 5;
              return g.apply(this, [url, options]);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();
})(_Page2.default.prototype.evaluateOnNewDocument, _Page2.default.prototype.goto);