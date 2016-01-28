export default (dispatch, ...types) => (action, payload) => {
  let a = {};
  if (types.length === 1) {
    a = {
      type: types[0],
      payload: {
        type: action,
        payload
      }
    };
  } else if (types.length === 2) {
    a = {
      type: types[0],
      payload: {
        type: types[1],
        payload: {
          type: action,
          payload
        }
      }
    };
  } else {
    throw new Error('err');
  }

  dispatch(a);
};
