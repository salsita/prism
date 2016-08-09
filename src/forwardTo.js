import wrapAction from './wrapAction';

/**
 * Returns new dispatch which automatically wraps all the actions by types chain
 *
 * @param {Function} Original dispatch
 * @param {...String} action types composition chain
 * @return {Function} Dispatch which automatically wraps all the actions
 */
export default (dispatch, ...types) => {
  if (types.length === 0) {
    return dispatch;
  } else {
    return action => dispatch(wrapAction(action, ...types));
  }
};
