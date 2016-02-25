/**
 * Wraps action into nested one where action type is corresponding with pattern which has its parts replaced by match.
 *
 * @param {Object} plain old Redux action eg. { type: 'Increment', payload: 1 }
 * @param {String} Pattern defining the action nesting eg. Counters.[CounterType]
 * @param {Object} Object used for compiling the action eg. { CounterType: 'Top' }
 *
 * @return {Object} Wrapped action eg. { type: 'Counters.Top.Increment', payload: 1 }
 */
export default (action, pattern, match) => {
  const type = Object
    .keys(match)
    .reduce((memo, chunk) =>
      memo.replace(`[${chunk}]`, match[chunk]), pattern) + `.${action.type}`;

  return {
    ...action,
    type
  };
};
