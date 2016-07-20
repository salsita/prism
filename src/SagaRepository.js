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
    const sagaInstance = new SagaAbstraction(saga, model);

    sagaInstance.subscribe(action =>
      dispatch({ ...action, type: wrap(action.type) }));

    this.sagas[sagaId] = sagaInstance;
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
