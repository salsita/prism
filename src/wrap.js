export default (action, pattern, match) => {
  const type = Object
    .keys(match)
    .reduce((memo, chunk) =>
      pattern.replace(`[${chunk}]`, match[chunk]), pattern) + `.${action.type}`;

  return {
    ...action,
    type
  };
};
