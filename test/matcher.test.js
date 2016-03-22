import { assert } from 'chai';

import matcher from '../src/matchers/matcher';

describe('matcher', () => {
  it('should return unwrapped action', () => {
    assert.deepEqual(matcher('Foo')({ type: 'Foo.Bar' }), ['Bar']);
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(matcher('Foo')({ type: 'BarFoo' }));
    assert.isFalse(matcher('Foo')({ type: 'Bar.Foo' }));
  });

  it('should not match when there\'s no sub-action', () => {
    assert.isFalse(matcher('Foo')({ type: 'Foo' }));
  });
});
