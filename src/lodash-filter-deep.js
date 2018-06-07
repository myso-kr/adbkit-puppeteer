import _ from 'lodash';
_.mixin({
  filterDeep(collection, predicate = _.identity) {
    collection = _.isArray(collection) ? collection : [collection];
    const o = _.filter(collection, predicate);
    const c = _.reduce(collection, (o, v) => ((_.isPlainObject(v) || _.isArray(v)) && o.push.apply(o, _.values(v)), o), [])
    const j = _.reduce(c, (o, v) => (o.push.apply(o, _.filterDeep(v, predicate)), o), []);
    return (o.push.apply(o, j), o);
  },
  findDeep(collection, predicate = _.identity) {
    return _.nth(_.filterDeep(collection, predicate), 0);
  }
})