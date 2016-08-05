import { Subject } from 'rxjs';

const isAction = any => any && typeof any === 'object' && !!any.type;

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
      .filter(action => isAction(action))
      .subscribe(subscriber);
  }

  dispatch(action) {
    this.subject.next([action, this.model]);
  }

  dispose() {
    this.saga$.dispose();
    this.subject.dispose();
  }
}
