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
   */
  constructor(saga, model) {
    this.updateModel(model);
    this.subject = new Subject();
    this.saga$ = saga(this.subject);

    this.subscribtion = null;
  }

  /**
   * Updates the model for Saga
   * @param {any} new model
   */
  updateModel(model) {
    this.model = model;
  }

  /**
   * Subscribes to all the actions
   * newly created by Saga implementation. It's
   * the output of the action pipe.
   *
   * @param {Function} Subscriber function
   * @return {Disposable} RXJS Disposable
   */
  subscribe(subscriber) {
    this.subscribtion = this
      .saga$
      .filter(isAction)
      .subscribe(subscriber);

    return this.subscribtion;
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
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }
}
