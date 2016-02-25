/**
 * Sums number of characters in array of strings ['abc', 'def'] returns 6
 *
 * @param {Array} array of strings
 * @return {Number} Sum of characters
 */
export const sumCharsInArrayOfStrings = arr => arr.reduce((memo, element) => memo + element.length, 0);

/**
 * Returns last element of the provided array
 *
 * @param {Array} input array
 * @return {any} last element of array
 */
export const last = arr => arr.length ? arr[arr.length - 1] : null;

/**
 * Checks whether provided input is type of String
 *
 * @param {any} checking input
 * @return {Bool}
 */
export const isString = any => typeof any === 'string';
