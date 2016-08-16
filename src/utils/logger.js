const log = (message, level) => {
  if (typeof console !== 'undefined' && typeof console[level] === 'function') {
    console[level](`WARNING: ${message}`);
  }
};

export const warn = message => // eslint-disable-line import/prefer-default-export
  log(message, 'error');
