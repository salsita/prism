import { assert } from 'chai';

import matcher from '../../src/matching/matchers/matcher';

describe('matcher', () => {
  it('should return unwrapped action', () => {
    const result = matcher('Foo')({ type: 'Foo.Bar' });
    assert.equal(result.wrap('Qux'), 'Foo.Qux');
    assert.equal(result.unwrappedType, 'Bar');
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(matcher('Foo')({ type: 'BarFoo' }));
    assert.isFalse(matcher('Foo')({ type: 'Bar.Foo' }));
  });

  it('should return pattern for exact match', () => {
    const pattern = 'Foo';
    const result = matcher(pattern)({ type: pattern });

    assert.equal(result.unwrappedType, 'Foo');
    assert.equal(result.wrap(pattern), pattern);
  });

  it('should not match the action there\'s no exact match nor unwrapping', () => {
    assert.isFalse(matcher('Foo')({ type: 'FooBar' }));
  });
});
