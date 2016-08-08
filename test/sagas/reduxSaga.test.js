import { assert } from 'chai';
import { spy } from 'sinon';
import { takeEvery } from 'redux-saga';
import { take, put, select } from 'redux-saga/effects';

import ReduxSaga from '../../src/sagas/ReduxSaga';


function* pingPongSaga() {
  yield* takeEvery('Ping', function*() {
    yield put({ type: 'Pong' });
  });
}

describe('ReduxSaga', () => {
  it('should allow to subscribe to output action stream', done => {
    const saga = new ReduxSaga(pingPongSaga, 0);
    const subscribeSpy = spy();
    saga.subscribe(subscribeSpy);
    saga.dispatch({ type: 'Ping' });

    setTimeout(() => {
      assert.isTrue(subscribeSpy.called);
      done();
    });
  });

  it('should ignore those actions in which saga is not subscribed', done => {
    const saga = new ReduxSaga(pingPongSaga, 0);
    const subscribeSpy = spy();
    saga.subscribe(subscribeSpy);
    saga.dispatch({ type: 'UnknownAction' });

    setTimeout(() => {
      assert.isFalse(subscribeSpy.called);
      done();
    });
  });

  it('should pass current model as well as action', done => {
    let modelResult = null;

    function* testingSaga() {
      modelResult = yield select(model => model);
    }

    const saga = new ReduxSaga(testingSaga, 42);
    saga.subscribe(() => {});
    saga.dispatch({ type: 'FooBar' });

    setTimeout(() => {
      assert.equal(modelResult, 42);
      done();
    });
  });

  it('should allow updating model and passing it to the sagas', done => {
    let modelResult = null;

    function* testingSaga() {
      yield take('FooBar');
      modelResult = yield select(model => model);
    }

    const saga = new ReduxSaga(testingSaga, 42);
    saga.subscribe(() => {});
    saga.updateModel(24);
    saga.dispatch({ type: 'FooBar' });

    setTimeout(() => {
      assert.equal(modelResult, 24);
      done();
    });
  });

  it('should dispose saga properly', done => {
    function* emptySaga() {
      take('Foo');
    }

    const saga = new ReduxSaga(emptySaga, 0);
    saga.dispatch({ type: 'Foo' });
    saga.dispose();
    setTimeout(done);
  });
});
