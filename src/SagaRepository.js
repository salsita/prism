import { warn } from './utils/logger';

export default class SagaRepository {

  constructor() {
    this.sagas = {};
  }

  mount(
    SagaAbstraction,
    sagaId,
    saga,
    wrap,
    model,
    dispatch
  ) {
    if (!this.sagas[sagaId]) {
      const sagaInstance = new SagaAbstraction(saga, model);

      sagaInstance.subscribe(action =>
        dispatch({ ...action, type: wrap(action.type) }));

      this.sagas[sagaId] = sagaInstance;
    } else {
      warn(
        'The Saga instance has already been mounted, this basically mean ' +
        'that your Updaters do not form a tree hierarchy, please be sure that ' +
        'any used Updater is wrapped by any other Updater (except root updater). ' +
        'It does not make sense to use combineReducers for Updaters.'
      );
    }
  }

  unmount(sagaId) {
    const saga = this.sagas[sagaId];

    if (saga) {
      saga.dispose();
      delete this.sagas[sagaId];
    }
  }

  dispatch(sagaId, model, action) {
    const saga = this.sagas[sagaId];

    if (saga) {
      saga.updateModel(model);
      saga.dispatch(action);
    }
  }
}
