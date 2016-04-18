import { assert } from 'chai';

import * as Generators from '../src/generators';

describe('Generator friendly map function', () => {
  it('should not allow to pass non-function mapper', () => {
    try {
      Generators.map([], null).next();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: Mapper must be a Function');
    }
  });

  it('should not allow to pass non array list', () => {
    try {
      Generators.map('aef', () => {}).next();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: First argument must be an array');
    }
  });

  it('should map array by mapper', () => {
    const arr = [1, 2, 3, 4];

    const it = Generators.map(arr, function*(value, index) {
      return value + index;
    });

    assert.deepEqual(it.next(), {
      value: [1, 3, 5, 7],
      done: true
    });
  });

  it('should yield all values within mapper', () => {
    const arr = [1, 2, 3];

    const it = Generators.map(arr, function*(value) {
      yield value;

      return value + 1;
    });

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
      value: [2, 3, 4],
      done: true
    });
  });
});

describe('Generator friendly reduce function', () => {
  it('should not allow to pass non-function reducer', () => {
    try {
      Generators.reduce([], null).next();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: Reducer must be a Function');
    }
  });

  it('should not allow to pass non array list', () => {
    try {
      Generators.reduce('aef', () => {}).next();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: First argument must be an array');
    }
  });

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
