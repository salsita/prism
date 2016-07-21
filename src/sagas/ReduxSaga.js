import { runSaga } from 'redux-saga';
import { Subject } from 'rxjs';

export default class ReduxSaga {

  constructor(saga, model) {
    this.updateModel(model);

    this.dispatchSubject = new Subject();
    this.subscribeSubject = new Subject();

    this.saga = runSaga(saga(), {
      subscribe: cb => {
        const disposable = this.dispatchSubject.subscribe(cb);
        return () => disposable.dispose();
      },
      dispatch: action => this.subscribeSubject.next(action),
      getState: () => this.model
    });
  }

  updateModel(model) {
    this.model = model;
  }

  subscribe(subscriber) {
    return this
      .subscribeSubject
      .subscribe(subscriber);
  }

  dispatch(action) {
    this.dispatchSubject.next(action);
  }

  dispose() {
    if (!this.saga.isCancelled()) {
      this.saga.cancel();
    }

    this.dispatchSubject.dispose();
    this.subscribeSubject.dispose();
  }
}
