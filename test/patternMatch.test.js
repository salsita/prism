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

  it('should look for exact match when static chunk is provided', () => {
    const reducer = spy();
    const rootReducer = patternMatch(42)
      .case('Foo.Bar', reducer);

    rootReducer(undefined, { type: 'Foo.BarXYZ', payload: 43 });
    assert.isFalse(reducer.called);
  });

  it('should not match the action when action type does not start by the pattern', () => {
    const reducer = spy();
    const rootReducer = patternMatch(42)
      .case('Foo', reducer);

    rootReducer(undefined, { type: 'Bar.Foo.Xyz', payload: 43 });
    assert.isFalse(reducer.called);
  });
});
