import escapeStringRegexp from 'escape-string-regexp';

/**
 * Default matcher implementation,
 * The Matcher primarly looks for exact match in action type, if there
 * is no exact match, implementation fall backs to unwrapping.
 */
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
          wrap: `${pattern}.`,
          unwrap: match[1],
          args: {}
        };
      } else {
        return false;
      }
    }
  };
};

