const ALPHANUMERICAL_GROUP_REGEXP_STRING = '([a-zA-Z0-9\-]*)';

export default pattern => {
  const patterns = pattern
    .split('.')
      .map(chunk => {
        const match = chunk.match(/\[([a-zA-Z0-9\-]*)\]/);

        if (match) {
          return {
            dynamic: true,
            name: match[1]
          };
        } else {
          return {
            dynamic: false,
            name: chunk
          };
        }
      });

  const regExp = patterns
    .reduce((memo, chunk, index) => {
      const isLast = index === patterns.length - 1;

      if (chunk.dynamic) {
        return memo + ALPHANUMERICAL_GROUP_REGEXP_STRING + `\\.${isLast ? '?' : ''}`;
      } else {
        return memo + chunk.name + `\\.${isLast ? '?' : ''}`;
      }
    }, '') + '(.*)';

  return {
    patterns,
    regExp: new RegExp(regExp)
  };
};
