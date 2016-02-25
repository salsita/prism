import { assert } from 'chai';

import unwrap from '../src/unwrap';

describe('unwrap', () => {
  it('should unwrap the action based on provided match and pattern', () => {
    const unwrapped = unwrap('Baz.Qux.[arg1].[arg2]')({ type: 'Baz.Qux.42.43.Foobar', payload: 42 });

    assert.deepEqual(unwrapped, {
      type: 'Foobar',
      payload: 42,
      match: {
        arg1: '42',
        arg2: '43'
      }
    });
  });
});
