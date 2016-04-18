import { invariant, isFunction } from './utils';

/**
 * Traditional Reduce function which works with generators (propagate yields)
 *
 * @param {Array} Input array
 * @param {Function} Reducer Generator function
 * @param {Any} initial reduction
 *
 * @return {Any} Reduction
 */
export function* reduce(list, reducer, initialReduction) {
  invariant(Array.isArray(list), 'First argument must be an array');
  invariant(isFunction(reducer), 'Reducer must be a Function');

  function* recur(index, acc) {
    const mutated = yield* reducer(acc, list[index], index);

    if (index < list.length - 1) {
      return yield* recur(index + 1, mutated);
    } else {
      return mutated;
    }
  }

  if (list.length > 0) {
    return yield* recur(0, initialReduction);
  } else {
    return initialReduction;
  }
}

/**
 * Traditional Map function which works with generators (propagate yields)
 *
 * @param {Array} Input array
 * @param {Function} Mapper function
 *
 * @return {Array} Mapped Array
 */
export function* map(list, mapper) {
  invariant(Array.isArray(list), 'First argument must be an array');
  invariant(isFunction(mapper), 'Mapper must be a Function');

  function* recur(index, current) {
    const mapped = [...current, yield* mapper(list[index], index)];

    if (index < list.length - 1) {
      return yield* recur(index + 1,  mapped);
    } else {
      return mapped;
    }
  }

  if (list.length > 0) {
    return yield* recur(0, []);
  } else {
    return list;
  }
}
