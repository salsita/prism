import { assert } from 'chai';

import * as Utils from '../src/utils';

describe('utils', () => {
  it('should return last element of array', () => {
    assert.equal(Utils.last([1, 2, 3]), 3);
    assert.equal(Utils.last([1]), 1);
  });

  it('should return null when array is empty', () => {
    assert.equal(Utils.last([]), null);
  });

  it('should return true if provided argument is string', () => {
    assert.isTrue(Utils.isString(''));
    assert.isTrue(Utils.isString('foo'));
  });

  it('should not return true if provided argument is not string', () => {
    assert.isFalse(Utils.isString());
    assert.isFalse(Utils.isString(null));
    assert.isFalse(Utils.isString(0));
    assert.isFalse(Utils.isString(() => {}));
    assert.isFalse(Utils.isString(new Date()));
  });

  it('should sum all the characters in array of strings', () => {
    assert.equal(Utils.sumCharsInArrayOfStrings(['abc', 'def']), 6);
    assert.equal(Utils.sumCharsInArrayOfStrings(['abc', '']), 3);
    assert.equal(Utils.sumCharsInArrayOfStrings(['abc']), 3);
    assert.equal(Utils.sumCharsInArrayOfStrings(['abc', ' ']), 4);
    assert.equal(Utils.sumCharsInArrayOfStrings([]), 0);
  });
});
