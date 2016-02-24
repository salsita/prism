
export const sumCharsInArrayOfStrings = arr => arr.reduce((memo, element) => memo + element.length, 0);

export const last = arr => arr[arr.length - 1];

export const isString = any => typeof any === 'string';
