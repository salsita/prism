import escapeStringRegexp from 'escape-string-regexp';

export default pattern => {
  const regexp = new RegExp(`^${escapeStringRegexp(pattern)}\\.(.+)`);

  return action => {
    if (action.type === pattern) {
      return {
        wrap: '',
        unwrap: action.type,
        args: {}
      };
    } else {
      const match = action.type.match(regexp);

      if (match) {
        return {
          wrap: action.type.replace(match[1], ''),
          unwrap: match[1],
          args: {}
        };
      } else {
        return false;
      }
    }
  };
};

