import { assert } from 'chai';

import wrapAction from '../src/wrapAction';

describe('wrapAction', () => {
  it('should wrap action by action types', () => {
    const wrappedAction = wrapAction({
      type: 'Foo'
    }, 'Bar');

    assert.deepEqual(wrappedAction, {
      type: 'Bar.Foo'
    });
  });

  it('should wrap action by action types and keep the payload', () => {
    const wrappedAction = wrapAction({
      type: 'Foo',
      payload: 42
    }, 'Bar');

    assert.deepEqual(wrappedAction, {
      type: 'Bar.Foo',
      payload: 42
    });
  });

  it('should allow to wrap the action by multiple types', () => {
    const wrappedAction = wrapAction({
      type: 'Baz'
    }, 'Foo', 'Bar', 'Qux');

    assert.deepEqual(wrappedAction, {
      type: 'Foo.Bar.Qux.Baz'
    });
  });

  it('should not change the action reference when no wrapping is provided', () => {
    const action = {
      type: 'Foo'
    };
    assert.equal(action, wrapAction(action));
  });

  it('should throw an error when type chain contains dot', () => {
    try {
      wrapAction({
        type: 'Foo'
      }, 'Bar.Baz');
    } catch (ex) {
      assert.equal(ex.message, 'Action type can\'t contain a dot');
    }
  });
});
