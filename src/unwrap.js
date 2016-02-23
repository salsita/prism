import parsePattern from './parsePattern';

const last = arr => arr[arr.length - 1];

export default (action, pattern) => {
  const parsedPattern = parsePattern(pattern);

  const regExpMatch = action.type.match(parsedPattern.regExp);
  if (regExpMatch) {
    regExpMatch.shift();
    const type = last(regExpMatch);

    const match = parsedPattern
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
