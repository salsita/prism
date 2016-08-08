import wrapAction from './wrapAction';

/**
 * Modify dispatch by wrapping all the outgoing actions by composition chain
 *
 * @param {Function} dispatch
 * @param {...String} action composition chain
 * @return {Function} modified dispatch
 */
export default (dispatch, ...types) => {
  if (types.length === 0) {
    return dispatch;
  } else {
    if (types.some(type => ~type.toString().indexOf('.'))) {
      throw new Error('Action type can\'t contain a dot');
    }

    return action => dispatch(wrapAction(action, ...types));
  }
};
