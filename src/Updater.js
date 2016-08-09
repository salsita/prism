import MatchingReducerFactory from './matching/MatchingReducerFactory';
import ReduxSaga from './sagas/ReduxSaga';
import { Mount, Unmount } from './actions';

/**
 * Returns dispatch which automatically
 * wraps the action by wrapping function
 * specified in action matching payload
 *
 * @param {Function} Original dispatch
 * @param {Object} Parent action
 * @return {Function} Wrapped dispatch
 */
const wrapDispatch = (dispatch, action) => {
  if (action.matching && action.matching.wrap) {
    return dispatchable => dispatch({
      ...dispatchable,
      type: action.matching.wrap(dispatchable.type)
    });
  } else {
    return dispatch;
  }
};

/**
 * @class Updater
 *
 * Updater is a class which glues everything together.
 *
 * It can wrap/unwrap action by using MatchingReducerFactory.
 *
 * It reacts to incoming Mount/Unmount actions which are dispatched
 * in View.
 *
 * It is using Saga Repository to Mount/Unmount Sagas based
 * on Action wrapping.
 */
export default class Updater {

  /**
   * @param {any} Initial Model
   * @param {any} Saga implementation
   * @param {Matcher} Default Matcher implementation
   * @param {SagaAbstraction} Saga abstraction (rxjs, redux-saga...)
   */
  constructor(initialModel, saga = null, defaultMatcherImpl, SagaAbstraction = ReduxSaga) {
    this.saga = saga;
    this.matchingReducerFactory = new MatchingReducerFactory(initialModel, defaultMatcherImpl);
    this.SagaAbstraction = SagaAbstraction;
  }

  /**
   * @param {string} Handling pattern
   * @param {Function} Action handler function (eg. reducer in redux)
   * @param {Matcher} Specific Matcher implementation
   */
  case(pattern, actionHandler, matcherImpl) {
    this
      .matchingReducerFactory
      .case(pattern, actionHandler, matcherImpl);

    return this;
  }


  /**
   * Converts Updater to plain old redux reducer.
   *
   * @return {Function} Plain old redux reducer
   */
  toReducer() {
    const reducer = this.matchingReducerFactory.toReducer();

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

        const sagaId = action.matching ? action.matching.id : '';
        const mutatedModel = reducer(model, action);

        if (effectExecutor) {
          effectExecutor(dispatch => {
            if (action.type === Mount && sagaRepository && saga) {
              sagaRepository.mount(
                SagaAbstraction,
                sagaId,
                saga,
                mutatedModel,
                wrapDispatch(dispatch, action)
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
