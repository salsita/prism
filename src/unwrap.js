import compilePattern from './compilePattern';
import * as Utils from './utils';

/**
 * Returns unwrap function for specified pattern
 *
 * @param {String} Pattern eg. Counters.[CounterType]
 *
 * @return {Function} unwrap function
 */
export default pattern => {
  const compiledPattern = compilePattern(pattern);

  /**
   * Unwraps the action using compiled pattern
   *
   * @param {Object} Wrapped redux action eg. { type: 'Counters.Top.Increment', payload: 1 }
   *
   * @return {Object} Unwrapped action containing match { type: 'Increment', payload: 1, match: { CounterType: 'Top' } }
   */
  return action => {
    const regExpMatch = action.type.match(compiledPattern.regExp);
    if (regExpMatch) {
      regExpMatch.shift();
      const type = Utils.last(regExpMatch);

      const match = compiledPattern
        .chunks
        .filter(current => current.dynamic)
        .reduce((memo, current, index) => ({ ...memo, [current.name]: regExpMatch[index] }), {});

      return {
        ...action,
        type,
        match: {
          ...(action.match || {}),
          [pattern]: match
        }
      };
    } else {
      return false;
    }
  };
};
