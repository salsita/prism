import { assert } from 'chai';

import parameterizedMatcher from '../src/matchers/parameterizedMatcher';

describe('parameterized matcher', () => {
  it('should provide unwrapped action and parameter', () => {
    assert.deepEqual(parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar'}), ['Bar', 'Parameter']);
  });

  it('should allow unwrapped action nesting', () => {
    assert.deepEqual(parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar.Baz'}), ['Bar.Baz', 'Parameter']);
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar.Baz'}));
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar'}));
  });
});
