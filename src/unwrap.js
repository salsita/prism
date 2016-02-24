import compilePattern from './compilePattern';

const last = arr => arr[arr.length - 1];

export default pattern => {
  const compiledPattern = compilePattern(pattern);

  return action => {
    const regExpMatch = action.type.match(compiledPattern.regExp);
    if (regExpMatch) {
      regExpMatch.shift();
      const type = last(regExpMatch);

      const match = compiledPattern
        .patterns
        .filter(current => current.dynamic)
        .reduce((memo, current, index) => ({ ...memo, [current.name]: regExpMatch[index] }), {});

      return {
        ...action,
        type,
        match
      };
    } else {
      return false;
    }
  };
};
