import { spy } from 'sinon';
import { assert } from 'chai';
import { take } from 'redux-saga/effects';
import Updater from '../src/Updater';
import * as Actions from '../src/actions';

describe('updater', () => {
  it('should persist running sagas after Updater re-instantiating', () => {
    const TESTING_ACTION = 'Foo';
    const generatorSpy = spy();
    const effectExecutor = cb => cb();

    function* saga() {
      while (true) {
        yield take(TESTING_ACTION);
        generatorSpy();
      }
    }

    let reducer = new Updater(0, saga)
      .toReducer();

    reducer(0, { type: Actions.Mount, effectExecutor, wrap: '', unwrap: '' });
    reducer(0, { type: TESTING_ACTION, effectExecutor });
    reducer(0, { type: TESTING_ACTION, effectExecutor });

    reducer = new Updater(0, saga)
      .toReducer();

    reducer(0, { type: TESTING_ACTION, effectExecutor });
    reducer(0, { type: TESTING_ACTION, effectExecutor });

    assert.equal(generatorSpy.callCount, 4);
  });
});
