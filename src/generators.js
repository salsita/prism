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
