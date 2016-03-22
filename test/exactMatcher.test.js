import { assert } from 'chai';

import exactMatcher from '../src/matchers/exactMatcher';

describe('exact matcher', () => {
  it('should return pattern for exact match', () => {
    const pattern = 'Foo';
    assert.deepEqual(exactMatcher(pattern)({ type: pattern }), [pattern]);
  });

  it('should not match when action can be unwrapped', () => {
    assert.isFalse(exactMatcher('Foo')({ type: 'Foo.Bar' }));
  });

  it('should not match the action there\'s no exact match', () => {
    assert.isFalse(exactMatcher('Foo')({ type: 'FooBar' }));
  });
});
