import { assert } from 'chai';
import { spy } from 'sinon';

import RxjsSaga from '../../src/sagas/RxjsSaga';

const pingPongSaga = actions$ => actions$
  .filter(([action]) => action.type === 'Ping')
  .map(() => ({ type: 'Pong' }));

describe('RxjsSaga', () => {
  it('should allow to subscribe to output action stream', done => {
    const saga = new RxjsSaga(pingPongSaga, 0);
    const subscribeSpy = spy();
    saga.subscribe(subscribeSpy);
    saga.dispatch({ type: 'Ping' });

    setTimeout(() => {
      assert.isTrue(subscribeSpy.called);
      done();
    });
  });

  it('should ignore those actions in which saga is not subscribed', done => {
    const saga = new RxjsSaga(pingPongSaga, 0);
    const subscribeSpy = spy();
    saga.subscribe(subscribeSpy);
    saga.dispatch({ type: 'UnknownAction' });

    setTimeout(() => {
      assert.isFalse(subscribeSpy.called);
      done();
    });
  });

  it('should work with identity sagas', done => {
    const saga = new RxjsSaga(actions$ => actions$, 0);
    const subscribeSpy = spy();
    saga.subscribe(subscribeSpy);
    saga.dispatch({ type: 'UnknownAction' });

    setTimeout(() => {
      assert.isFalse(subscribeSpy.called);
      done();
    });
  });

  it('should pass current model as well as action', done => {
    const sagaSpy = spy();
    const saga = new RxjsSaga(actions$ => actions$.do(sagaSpy), 42);
    saga.subscribe(() => {});
    saga.dispatch({ type: 'FooBar' });

    setTimeout(() => {
      assert.isTrue(sagaSpy.called);
      assert.deepEqual(sagaSpy.firstCall.args[0], [{
        type: 'FooBar'
      }, 42]);
      done();
    });
  });

  it('should allow updating model and passing it to the sagas', done => {
    const sagaSpy = spy();
    const saga = new RxjsSaga(actions$ => actions$.do(sagaSpy), 42);
    saga.subscribe(() => {});
    saga.updateModel(24);
    saga.dispatch({ type: 'FooBar' });

    setTimeout(() => {
      assert.isTrue(sagaSpy.called);
      assert.deepEqual(sagaSpy.firstCall.args[0], [{
        type: 'FooBar'
      }, 24]);
      done();
    });
  });
});
