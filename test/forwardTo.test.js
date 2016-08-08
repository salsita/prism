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

  it('should throw an error when type chain contains dot', () => {
    try {
      const dispatch = spy();
      forwardTo(dispatch, 'Foo.Bar');
    } catch (ex) {
      assert.equal(ex.message, 'Action type can\'t contain a dot');
    }
  });

  it('should allow specifying multiple action types into which action should be wrapped', () => {
    const dispatch = spy();
    forwardTo(dispatch, 'Foo', 'Bar')({ type: 'Baz' });

    assert.deepEqual(dispatch.firstCall.args[0], {
      type: 'Foo.Bar.Baz'
    });
  });

  it('should keep all the additional fields in the action', () => {
    const payload = {
      foo: 42
    };

    const dispatch = spy();
    forwardTo(dispatch, 'Foo')({ type: 'Bar', payload });
    assert.equal(dispatch.firstCall.args[0].payload, payload);
  });
});
