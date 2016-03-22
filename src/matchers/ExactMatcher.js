import escapeStringRegexp from 'escape-string-regexp';

export default pattern => {
  const regexp = new RegExp(`^(${escapeStringRegexp(pattern)})$`);

  return action => {
    const match = action.type.match(regexp);

    if (match) {
      return [ match[0] ];
    } else {
      return false;
    }
  };
};
