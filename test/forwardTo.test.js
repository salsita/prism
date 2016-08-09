import { spy } from 'sinon';
import { assert } from 'chai';

import forwardTo from '../src/forwardTo';

describe('forwardTo', () => {
  it('should wrap all the dispatched actions', () => {
    const dispatch = spy();
    const forwarded = forwardTo(dispatch, 'Foo');

    forwarded({ type: 'Bar' });

    assert.isTrue(dispatch.called);
    assert.deepEqual(dispatch.firstCall.args[0], {
      type: 'Foo.Bar'
    });
  });

  it('should not modify the dispatch instance when no nesting is provided', () => {
    const dispatch = spy();
    const forwarded = forwardTo(dispatch);
    assert.equal(forwarded, dispatch);
  });
});
