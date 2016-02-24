import * as Utils from './utils';

const ALPHANUMERICAL_GROUP_REGEXP_STRING = '([a-zA-Z0-9\-]*)';
const PATTERN_VALIDATON_REGEXP = /[^.\[\]]+\.?|\[[^.\[\]]+\]\.?/g;

/**
 * Validates provided pattern
 *
 * @param {String} pattern
 * @return {Bool}
 */
const isPatternValid = pattern => {
  if (pattern && Utils.isString(pattern) && Utils.last(pattern) !== '.') {
    const matched = pattern.match(PATTERN_VALIDATON_REGEXP);

    return matched && Utils.sumCharsInArrayOfStrings(matched) === pattern.length;
  } else {
    return false;
  }
};

/**
 * Splits the pattern into chunks
 *
 * @param {String} pattern
 * @return {Array} List of chunks where chunk has name and flag "dynamic"
 */
const splitPatternToChunks = pattern => pattern
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

/**
 * Build RegExp which can be used for pattern matching the action
 *
 * @param {Array} chunks
 * @return {RegExp}
 */
const buildRegExpOfChunks = chunks => chunks
  .reduce((memo, chunk, index) => {
    const isLast = index === chunks.length - 1;

    if (chunk.dynamic) {
      return memo + ALPHANUMERICAL_GROUP_REGEXP_STRING + `\\.${isLast ? '?' : ''}`;
    } else {
      return memo + chunk.name + `\\.${isLast ? '?' : ''}`;
    }
  }, '') + '(.*)';

/**
 * Compiles String pattern which may look like: Foo.Bar.[Baz]
 * The pattern is basically dot separated chunks where chunk may be either dynamic or static. Square brackets indicates
 * that the chunk is dynamic.
 *
 * Function returns object which contains:
 * - list of chunks where chunk is identified by name and flag indicating that chunk is either dynamic or static
 * - Compiled regular expression which can be used for matching action
 *
 * @param {String} Pattern
 *
 * @returns {Object} List of Chunks and RegExp
 */
export default pattern => {
  if (!isPatternValid(pattern)) {
    throw new Error('Invalid pattern provided');
  }

  const chunks = splitPatternToChunks(pattern);
  const regExp = buildRegExpOfChunks(chunks);

  return {
    chunks,
    regExp: new RegExp(regExp)
  };
};
