import { assert } from 'chai';
import { spy } from 'sinon';

import patternMatch from '../src/patternMatch';

describe('patternMatch', () => {
  it('should call the reducer when corresponding pattern matches action', () => {
    const reducer = spy();
    const rootReducer = patternMatch(42)
      .case('Foo.[Dynamic].Bar', reducer);

    rootReducer(undefined, { type: 'Foo.SomethingReallyDynamic.Bar.Baz', payload: 43 });

    assert.deepEqual(reducer.firstCall.args, [42, {
      type: 'Baz',
      payload: 43,
      match: {
        Dynamic: 'SomethingReallyDynamic'
      }
    }]);
  });
});
