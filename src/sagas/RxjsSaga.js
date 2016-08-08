import { Subject } from 'rxjs';

const isAction = any => any && typeof any === 'object' && !!any.type;

export default class RxjsSaga {

  constructor(saga, model) {
    this.updateModel(model);
    this.subject = new Subject();
    this.saga$ = saga(this.subject);

    this.subscribtion = null;
  }

  updateModel(model) {
    this.model = model;
  }

  subscribe(subscriber) {
    this.subscribtion = this
      .saga$
      .filter(action => isAction(action))
      .subscribe(subscriber);

    return this.subscribtion;
  }

  dispatch(action) {
    this.subject.next([action, this.model]);
  }

  dispose() {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }
}
