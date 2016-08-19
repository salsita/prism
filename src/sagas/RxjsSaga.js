import { Subject } from 'rxjs';

const isAction = any => any && typeof any === 'object' && !!any.type;

/**
 * @class ReduxSaga
 *
 * RxJS implementation of Saga Abstraction.
 */
export default class RxjsSaga {

  /**
   * Starts the Saga
   *
   * @param {Function} Saga implementation
   * @param {any} initial model
   * @param {Function} dispatch function
   */
  constructor(saga, model, dispatch) {
    this.updateModel(model);
    this.subject = new Subject();
    this.saga$ = saga(this.subject);

    this.subscription = this.saga$
      .filter(isAction)
      .subscribe(dispatch);
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
    this.subject.next([action, this.model]);
  }

  /**
   * Releases all the resources
   */
  dispose() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
