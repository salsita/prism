/**
 * Simple invariant check.
 *
 * @param {Boolean} A condition to be met
 *
 * @param {String} An exception message to be thrown
 * @returns {void}
 */
export const invariant = (condition, message) => {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
};


/**
 * Checks whether provided argument is a function.
 *
 * @param {any} Anything
 *
 * @returns {Boolean} Result of function check
 */
export const isFunction = any => typeof any === 'function';

/**
 * Checks whether provided argument is generator.
 * The implementation is quite fragile. The current state
 * however does not allow reliable implementation of `isGenerator`
 * function.
 *
 * @param {any} Anything
 *
 * @returns {Boolean} Result of generator check
 */
export const isGenerator = fn => {
  // Generator should never throw an exception because
  // it's not executed, only iterable is returned
  try {
    if (isFunction(fn)) {
      const result = fn();
      return !!result && isFunction(result._invoke);
    } else {
      return false;
    }
  } catch (ex) {
    return false;
  }
};

/**
 * Iterates over iterable and returns list of all values.
 *
 * @param {Iterable} iterable
 *
 * @returns {Array} List of all values
 */
export const unwindIterable = iterable => {
  const data = [];

  const recur = it => {
    const next = it.next();
    data.push(next.value);

    if (next.done) {
      return data;
    } else {
      return recur(it);
    }
  };

  return recur(iterable);
};
