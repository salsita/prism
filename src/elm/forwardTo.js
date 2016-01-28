export default (dispatch, type) => (action, payload) => dispatch(type, {
  type: action,
  payload
});
