import { assert } from 'chai';

import matcher from '../src/matching/matchers/matcher';

describe('matcher', () => {
  it('should return unwrapped action', () => {
    assert.deepEqual(matcher('Foo')({ type: 'Foo.Bar' }), {
      wrap: 'Foo.',
      unwrap: 'Bar',
      args: {}
    });
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(matcher('Foo')({ type: 'BarFoo' }));
    assert.isFalse(matcher('Foo')({ type: 'Bar.Foo' }));
  });

  it('should return pattern for exact match', () => {
    const pattern = 'Foo';
    assert.deepEqual(matcher(pattern)({ type: pattern }), {
      unwrap: 'Foo',
      wrap: '',
      args: {}
    });
  });

  it('should not match the action there\'s no exact match nor unwrapping', () => {
    assert.isFalse(matcher('Foo')({ type: 'FooBar' }));
  });
});
