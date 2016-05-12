export default (action, ...types) => ({
  ...action,
  type: `${types.reduce((memo, type) => `${memo}${type}.`, '')}${action.type}`
});
