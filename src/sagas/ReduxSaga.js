import { runSaga } from 'redux-saga';
import { Subject } from 'rxjs';

export default class ReduxSaga {

  constructor(saga, model) {
    this.updateModel(model);

    this.dispatchSubject = new Subject();
    this.subscribeSubject = new Subject();

    this.saga = runSaga(saga(), {
      subscribe: cb => this.dispatchSubject.subscribe(cb),
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
    // TODO
  }
}
