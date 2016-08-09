import { spy } from 'sinon';
import { assert } from 'chai';
import { createStore, compose, applyMiddleware } from 'redux';
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

  it('should execute effects on timeout', done => {
    const effectSpy = spy();
    const reducer = (appState, action) => {
      if (action.type === 'Test') {
        action.effectExecutor(effectSpy);
        assert.isFalse(effectSpy.called);

        setTimeout(() => {
          assert.isTrue(effectSpy.called);
          done();
        });
      }
    };

    const store = createStore(reducer, undefined, storeEnhancer);
    store.dispatch({ type: 'Test' });
  });

  it('should provide dispatcher to effect executor', done => {
    let store; // eslint-disable-line prefer-const
    const effectSpy = spy();

    const reducer = (appState, action) => {
      if (action.type === 'Test') {
        action.effectExecutor(effectSpy);

        setTimeout(() => {
          assert.equal(effectSpy.firstCall.args[0], store.dispatch);
          done();
        });
      }
    };

    store = createStore(reducer, undefined, storeEnhancer);
    store.dispatch({ type: 'Test' });
  });

  it('should not provide effect executor in middlewares', () => {
    const spiedMiddleware = spy((next, action) => next(action));

    const spyMiddleware = spiedIdentityDispatch =>
      () =>
      next =>
      action => spiedIdentityDispatch(next, action);

    const identityReducer = state => state;

    const store = createStore(identityReducer, undefined, compose(
      storeEnhancer,
      applyMiddleware(
        spyMiddleware(spiedMiddleware)
      )
    ));
    store.dispatch({ type: 'Test' });

    assert.deepEqual(spiedMiddleware.firstCall.args[1], {
      type: 'Test'
    });
  });
});
