import escapeStringRegexp from 'escape-string-regexp';

export default pattern => {
  const regexp = new RegExp(`^${escapeStringRegexp(pattern)}\\.(.+)`);

  return action => {
    if (action.type === pattern) {
      return action;
    } else {
      const match = action.type.match(regexp);

      if (match) {
        return {
          ...action,
          type: match[1]
        };
      } else {
        return false;
      }
    }
  };
};
