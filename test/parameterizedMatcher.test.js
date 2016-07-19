import { assert } from 'chai';

import parameterizedMatcher from '../src/matching/matchers/parameterizedMatcher';

describe('parameterized matcher', () => {
  it('should provide unwrapped action and parameter', () => {
    assert.deepEqual(parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar' }), {
      wrap: 'Foo.Parameter.',
      unwrap: 'Bar',
      args: {
        param: 'Parameter'
      }
    });
  });

  it('should allow unwrapped action nesting', () => {
    assert.deepEqual(parameterizedMatcher('Foo')({ type: 'Foo.Parameter.Bar.Baz' }), {
      wrap: 'Foo.Parameter.',
      unwrap: 'Bar.Baz',
      args: {
        param: 'Parameter'
      }
    });
  });

  it('should not match when action does not start with pattern', () => {
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar.Baz' }));
    assert.isFalse(parameterizedMatcher('Foo')({ type: 'Bar' }));
  });
});
