export default (dispatch, chain) => action => dispatch({...action, type: `${chain}.${action.type}`});
