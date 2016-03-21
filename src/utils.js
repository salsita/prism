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
