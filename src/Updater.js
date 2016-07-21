import MatchingReducer from './matching/MatchingReducer';
import ReduxSaga from './sagas/ReduxSaga';
import { Mount, Unmount } from './actions';

export default class Updater {

  constructor(initialModel, saga = null, defaultMatcherImpl, SagaAbstraction = ReduxSaga) {
    this.saga = saga;
    this.matchingReducer = new MatchingReducer(initialModel, defaultMatcherImpl);
    this.SagaAbstraction = SagaAbstraction;
  }

  case(pattern, actionHandler, matcherImpl) {
    this
      .matchingReducer
      .case(pattern, actionHandler, matcherImpl);

    return this;
  }

  toReducer() {
    const reducer = this.matchingReducer.toReducer();

    const {
      saga,
      SagaAbstraction
    } = this;

    return (model, action) => {
      if (action) {
        const {
          sagaRepository,
          effectExecutor
        } = action;

        const sagaId = action.matching ? action.matching.path : '';
        const mutatedModel = reducer(model, action);

        if (effectExecutor) {
          effectExecutor(dispatch => {
            if (action.type === Mount && sagaRepository && saga) {
              sagaRepository.mount(
                SagaAbstraction,
                sagaId,
                saga,
                action.matching ? action.matching.wrap : value => value,
                mutatedModel,
                dispatch
              );
            } else if (action.type === Unmount && sagaRepository && saga) {
              sagaRepository.unmount(sagaId);
            } else if (sagaRepository && saga) {
              sagaRepository.dispatch(
                sagaId,
                mutatedModel,
                action
              );
            }
          });
        }

        return mutatedModel;
      } else {
        return reducer(model, action);
      }
    };
  }
}
