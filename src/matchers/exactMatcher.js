export default pattern => {
  return action => {
    if (action.type === pattern) {
      return [ action.type ];
    } else {
      return false;
    }
  };
};
