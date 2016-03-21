import { assert } from 'chai';

import * as Generators from '../src/generators';

describe('Generator friendly reduce function', () => {
  it('should reduce array by reducer', () => {
    const arr = [1, 2, 3, 4];

    const it = Generators.reduce(arr, function*(memo, value) {
      return memo + value;
    }, 1);

    assert.deepEqual(it.next(), {
      value: 11,
      done: true
    });
  });

  it('should return initial reduction if provided input array is empty', () => {
    const arr = [];

    const it = Generators.reduce(arr, function*(memo, value) {
      return memo + value;
    }, 42);

    assert.deepEqual(it.next(), {
      value: 42,
      done: true
    });
  });

  it('should yield all values within reducer', () => {
    const arr = [1, 2, 3];

    const it = Generators.reduce(arr, function*(memo, value) {
      yield value;

      return memo + value;
    }, 0);

    assert.deepEqual(it.next(), {
      value: 1,
      done: false
    });
    assert.deepEqual(it.next(), {
      value: 2,
      done: false
    });
    assert.deepEqual(it.next(), {
      value: 3,
      done: false
    });
    assert.deepEqual(it.next(), {
      value: 6,
      done: true
    });
  });
});
