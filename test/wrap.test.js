import { assert } from 'chai';

import wrap from '../src/wrap';

describe('wrap', () => {
  it('should wrap the action based on provided match and pattern', () => {
    const action = wrap({ type: 'Foo', payload: 42 }, 'Baz.Qux.[arg1].[arg2].Foobar', { arg1: 43, arg2: 44 });

    assert.deepEqual(action, {
      type: 'Baz.Qux.43.44.Foobar.Foo',
      payload: 42
    });
  });
});
