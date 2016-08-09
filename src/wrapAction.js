/** Wraps action by ...types chain
 *
 * @param {Object} Action
 * @param {...String} action composition chain
 * @return {Object} wrapped action
 */
export default (action, ...types) => {
  if (types.length === 0) {
    return action;
  } else {
    if (types.some(type => ~type.toString().indexOf('.'))) {
      throw new Error('Action type can\'t contain a dot');
    }

    return {
      ...action,
      type: `${types.join('.')}.${action.type}`
    };
  }
};
