import { Subject } from 'rxjs';

export default class RxjsSaga {

  constructor(saga, model) {
    this.updateModel(model);

    this.subject = new Subject();
    this.saga$ = saga(this.subject);
  }

  updateModel(model) {
    this.model = model;
  }

  subscribe(subscriber) {
    return this
      .saga$
      .subscribe(subscriber);
  }

  dispatch(action) {
    this.subject.next(action);
  }

  dispose() {
    // TODO
  }
}
