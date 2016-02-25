import { spy } from 'sinon';
import { assert } from 'chai';

import forwardTo from '../src/forwardTo';

describe('forwardTo', () => {
  it('should return new modified version of dispatch which prepends dot separated action list in the action type', () => {
    const dispatch = spy();
    const forwardedDispatch = forwardTo(dispatch, 'Foo', 'Bar');
    forwardedDispatch({ type: 'Baz' });

    assert.equal(dispatch.firstCall.args[0].type, 'Foo.Bar.Baz');
  });

  it('should not change refrence of the dispatch function if no action composition is defined', () => {
    const dispatch = spy();
    const forwardedDispatch = forwardTo(dispatch);
    forwardedDispatch({ type: 'Baz' });

    assert.equal(dispatch, forwardedDispatch);
  });

  it('should not allow dot in the type of action', () => {
    try {
      forwardTo(() => {}, 'b', 'a.');
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Action type can\'t contain dot');
    }
  });
});
