/**
 * TODO: re-write docs
 *
 * Returns modified version of dispatch function. The function automatically prepends
 * composed string reflecting composition of action types.
 *
 * @param {Function} dispatch function
 * @param {...String} Action types which defines action composition
 *
 * @returns {Function} Modified dispatch
 */
export default (dispatch, ...types) => {
  if (types.length === 0) {
    return dispatch;
  } else {
    if (types.some(type => ~type.toString().indexOf('.'))) {
      throw new Error('Action type can\'t contain dot');
    }

    return action => dispatch({...action, type: `${types.reduce((memo, type) => `${memo}${type}.`, '')}${action.type}`});
  }
};
