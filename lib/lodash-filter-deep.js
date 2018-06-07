'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lodash2.default.mixin({
  filterDeep: function filterDeep(collection) {
    var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _lodash2.default.identity;

    collection = _lodash2.default.isArray(collection) ? collection : [collection];
    var o = _lodash2.default.filter(collection, predicate);
    var c = _lodash2.default.reduce(collection, function (o, v) {
      return (_lodash2.default.isPlainObject(v) || _lodash2.default.isArray(v)) && o.push.apply(o, _lodash2.default.values(v)), o;
    }, []);
    var j = _lodash2.default.reduce(c, function (o, v) {
      return o.push.apply(o, _lodash2.default.filterDeep(v, predicate)), o;
    }, []);
    return o.push.apply(o, j), o;
  },
  findDeep: function findDeep(collection) {
    var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _lodash2.default.identity;

    return _lodash2.default.nth(_lodash2.default.filterDeep(collection, predicate), 0);
  }
});