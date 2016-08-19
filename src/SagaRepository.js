import { warn } from './utils/logger';

/**
 * @class SagaRepository
 *
 * A repository which holds references to all the
 * living Saga instances.
 */
export default class SagaRepository {

  constructor() {
    this.sagas = {};
  }

  /**
   * Mounts Saga instance
   *
   * @param {SagaAbstraction} Saga abstraction type (rxjs/redux-saga)
   * @param {String} ID of the Saga
   * @param {any} Saga implementation
   * @param {any} Current Model
   * @param {Function} dispatch function to be used for dispatching new actions
   */
  mount(
    SagaAbstraction,
    sagaId,
    saga,
    model,
    dispatch
  ) {
    if (!this.sagas[sagaId]) {
      this.sagas[sagaId] = new SagaAbstraction(saga, model, dispatch);
    } else {
      warn(
        'The Saga instance has already been mounted, this basically mean ' +
        'that your Updaters do not form a tree, please be sure that ' +
        'every Updater is wrapped by another Updater (except root updater). ' +
        'It does not make sense to use combineReducers for Updaters.'
      );
    }
  }

  /**
   * Unmounts Saga instance
   *
   * @param {String} ID of the Saga
   */
  unmount(sagaId) {
    const saga = this.sagas[sagaId];

    if (saga) {
      saga.dispose();
      delete this.sagas[sagaId];
    }
  }

  /**
   * Passes (dispatches) provided action
   * to all corresponding saga instances
   *
   * @param {String} ID of the Saga
   * @param {any} Updated model
   * @param {object} Action
   */
  dispatch(sagaId, model, action) {
    const saga = this.sagas[sagaId];

    if (saga) {
      saga.updateModel(model);
      saga.dispatch(action);
    }
  }
}
