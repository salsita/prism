import { spy } from 'sinon';
import { assert } from 'chai';

import SagaRepository from '../src/SagaRepository';
import RxjsSaga from '../src/sagas/RxjsSaga';

const pingPongSaga = action$ => action$
  .filter(([action]) => action.type === 'Ping')
  .map(() => ({ type: 'Pong' }));

const identity = value => value;

const TESTING_SAGA_ID = 'foobar';

describe('sagaRepository', () => {
  it('should allow mounting simple Saga in the repository', done => {
    const dispatch = spy();
    const sagaRepository = new SagaRepository();
    sagaRepository.mount(RxjsSaga, TESTING_SAGA_ID, pingPongSaga, identity, 42, dispatch);
    sagaRepository.dispatch(TESTING_SAGA_ID, 42, { type: 'Ping' });

    setTimeout(() => {
      assert.isTrue(dispatch.called);
      assert.deepEqual(dispatch.firstCall.args[0], {
        type: 'Pong'
      });
      done();
    });
  });

  it('should allow addressing right saga instance when dispatching action', done => {
    const dispatch = spy();

    const sagaRepository = new SagaRepository();
    sagaRepository.mount(RxjsSaga, 'Foo', pingPongSaga, type => `Foo.${type}`, 42, dispatch);
    sagaRepository.mount(RxjsSaga, 'Bar', pingPongSaga, type => `Bar.${type}`, 42, dispatch);
    sagaRepository.dispatch('Foo', 42, { type: 'Ping' });
    sagaRepository.dispatch('Bar', 42, { type: 'Ping' });
    sagaRepository.dispatch('Baz', 42, { type: 'Ping' });
    sagaRepository.dispatch('Foo', 42, { type: 'Qux' });

    setTimeout(() => {
      assert.equal(dispatch.callCount, 2);
      assert.deepEqual(dispatch.firstCall.args[0], {
        type: 'Foo.Pong'
      });
      assert.deepEqual(dispatch.secondCall.args[0], {
        type: 'Bar.Pong'
      });

      done();
    });
  });

  it('should ignore dispatched actions when saga gets unmounted', done => {
    const dispatch = spy();

    const sagaRepository = new SagaRepository();
    sagaRepository.mount(RxjsSaga, TESTING_SAGA_ID, pingPongSaga, identity, 42, dispatch);
    sagaRepository.dispatch(TESTING_SAGA_ID, 42, { type: 'Ping' });
    sagaRepository.unmount(TESTING_SAGA_ID);
    sagaRepository.dispatch(TESTING_SAGA_ID, 42, { type: 'Ping' });

    setTimeout(() => {
      assert.isTrue(dispatch.called);
      assert.deepEqual(dispatch.firstCall.args[0], {
        type: 'Pong'
      });
      assert.equal(dispatch.callCount, 1);

      done();
    });
  });

  it('should allow passing changed model when dispatching an action', done => {
    const actionSpy = spy();

    const sagaRepository = new SagaRepository();
    sagaRepository
      .mount(RxjsSaga, TESTING_SAGA_ID, action$ => action$.do(actionSpy), identity, 42, identity);
    sagaRepository.dispatch(TESTING_SAGA_ID, 43, { type: 'Whatever' });

    setTimeout(() => {
      assert.isTrue(actionSpy.called);
      assert.deepEqual(actionSpy.firstCall.args[0], [{
        type: 'Whatever'
      }, 43]);
      done();
    });
  });
});
