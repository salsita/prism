import escapeStringRegexp from 'escape-string-regexp';

export default pattern => {
  const regexp = new RegExp(`^${escapeStringRegexp(pattern)}\\.([^.]+)\\.(.+)`);

  return action => {
    const match = action.type.match(regexp);

    if (match) {
      return {
        unwrap: match[2],
        wrap: action.type.replace(match[2], ''),
        args: {
          param: match[1]
        }
      };
    } else {
      return false;
    }
  };
};

