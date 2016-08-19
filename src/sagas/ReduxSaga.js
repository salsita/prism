import { runSaga } from 'redux-saga';
import { Subject } from 'rxjs';

/**
 * @class ReduxSaga
 *
 * ReduxSaga implementation of Saga Abstraction.
 */
export default class ReduxSaga {

  /**
   * Starts the Saga
   *
   * @param {Generator} Saga implementation
   * @param {any} initial model
   * @param {Function} dispatch function
   */
  constructor(saga, model, dispatch) {
    this.updateModel(model);

    this.dispatchSubject = new Subject();
    this.subscribeSubject = new Subject();
    this.subscription = this.subscribeSubject.subscribe(dispatch);

    this.saga = runSaga(saga(), {
      subscribe: cb => {
        const disposable = this.dispatchSubject.subscribe(cb);
        return () => disposable.unsubscribe();
      },
      dispatch: action => this.subscribeSubject.next(action),
      getState: ::this.getModel
    });
  }

  /**
   * Gets current Model
   * @private
   * @return {any} Current model
   */
  getModel() {
    return this.model;
  }

  /**
   * Updates the model for Saga
   * @param {any} new model
   */
  updateModel(model) {
    this.model = model;
  }

  /**
   * Feeds the Saga with new actions.
   * This is the input ouf the action pipe.
   *
   * @param {Object] Action
   */
  dispatch(action) {
    this.dispatchSubject.next(action);
  }

  /**
   * Releases all the resources
   */
  dispose() {
    if (!this.saga.isCancelled()) {
      this.saga.cancel();

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
}
