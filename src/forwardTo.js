export default (dispatch, ...types) => {
  if (types.length === 0) {
    return dispatch;
  } else {
    if (types.some(type => ~type.toString().indexOf('.'))) {
      throw new Error('Action type can\'t contain a dot');
    }

    return action => dispatch({...action, type: `${types.reduce((memo, type) => `${memo}${type}.`, '')}${action.type}`});
  }
};
