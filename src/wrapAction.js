/** Wraps action by ...types chain
 *
 * @param {Object} Action
 * @param {...String} action composition chain
 * @return {Object} wrapped action
 */
export default (action, ...types) => ({
  ...action,
  type: `${types.reduce((memo, type) => `${memo}${type}.`, '')}${action.type}`
});
