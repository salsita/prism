import { assert } from 'chai';

import parameterizedMatcher from '../../src/matching/matchers/parameterizedMatcher';

describe('parameterized matcher', () => {
  it('should provide unwrapped action and parameter', () => {
    const result = parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar' });

    assert.equal(result.unwrappedType, 'Bar');
    assert.equal(result.wrap('Bar'), 'Foo.Parameter.Bar');
    assert.deepEqual(result.args, {
      param: 'Parameter'
    });
  });

  it('should allow unwrapped action nesting', () => {
    const result = parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar.Baz' });

    assert.equal(result.wrap('Bar.Baz'), 'Foo.Parameter.Bar.Baz');
    assert.equal(result.unwrappedType, 'Bar.Baz');
    assert.deepEqual(result.args, {
      param: 'Parameter'
    });
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar.Baz' }));
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar' }));
  });
});
