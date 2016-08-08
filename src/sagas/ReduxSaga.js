import { runSaga } from 'redux-saga';
import { Subject } from 'rxjs';

export default class ReduxSaga {

  constructor(saga, model) {
    this.updateModel(model);

    this.dispatchSubject = new Subject();
    this.subscribeSubject = new Subject();
    this.subscribtion = null;

    this.saga = runSaga(saga(), {
      subscribe: cb => {
        const disposable = this.dispatchSubject.subscribe(cb);
        return () => disposable.unsubscribe();
      },
      dispatch: action => this.subscribeSubject.next(action),
      getState: ::this.getModel
    });
  }

  getModel() {
    return this.model;
  }

  updateModel(model) {
    this.model = model;
  }

  subscribe(subscriber) {
    this.subscribtion = this
      .subscribeSubject
      .subscribe(subscriber);

    return this.subscribtion;
  }

  dispatch(action) {
    this.dispatchSubject.next(action);
  }

  dispose() {
    if (!this.saga.isCancelled()) {
      this.saga.cancel();

      if (this.subscribtion) {
        this.subscribtion.unsubscribe();
      }
    }
  }
}
