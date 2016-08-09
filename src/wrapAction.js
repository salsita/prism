/** Wraps action by ...types chain
 *
 * @param {Object} Original Action
 * @param {...String} Action type composition chain
 * @return {Object} Wrapped Action
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
