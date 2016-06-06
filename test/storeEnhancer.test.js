import { spy } from 'sinon';
import { assert } from 'chai';
import { createStore } from 'redux';
import storeEnhancer from '../src/storeEnhancer';

describe('store enhancer', () => {
  it('should provide effect executor to reducer when the reducer is replaced', () => {
    const reducer = spy();
    const store = createStore(reducer, undefined, storeEnhancer);
    store.dispatch({ type: 'Foo' });

    assert.equal(typeof reducer.firstCall.args[1].effectExecutor, 'function');

    const replacedReducer = spy();
    store.replaceReducer(replacedReducer);
    store.dispatch({ type: 'Bar' });

    assert.equal(typeof replacedReducer.firstCall.args[1].effectExecutor, 'function');

    assert.equal(reducer.callCount, 2);
    assert.equal(replacedReducer.callCount, 2);
  });
});
