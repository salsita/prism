import SagaRepository from './SagaRepository';
import { warn } from './utils/logger';

/**
 * Main redux-elm store enhancer, allowing dispatching in reducers while
 * maintaing their purity.
 *
 * @param {Function} createStore
 * @return {Function} enhanced store factory
 */
export default createStore => (reducer, initialAppState) => {
  let store = null;
  let executeEffects = false;
  let wrappedDispatch = null;

  // Sets global flag to
  // enable execution of all the effects
  const callFnWithEffects = fn => {
    executeEffects = true;
    const result = fn();
    executeEffects = false;
    return result;
  };

  const effectExecutor = effect => {
    // Effect executor executes
    // the effect only when it's allowed
    // (executeEffects is true)
    if (executeEffects) {
      // Effect execution must be asynchronous
      // so that it's called out of order in the
      // reducer and therefore the reducer remains
      // "almost" pure
      setTimeout(() => {
        if (wrappedDispatch) {
          effect(wrappedDispatch);
        } else {
          warn('Attempt to execute effects before store creation has completed');
        }
      });
    }
  };

  const sagaRepository = new SagaRepository();

  // When creating store
  // we wrap the reducer with function
  // which provides sagaRepository & effectExecutor
  // to root reducer
  callFnWithEffects(() => {
    store = createStore((appState, action) =>
      reducer(appState, {
        ...action,
        sagaRepository,
        effectExecutor
      }), initialAppState);
  });

  // Wrapped dispatch executes all the effects
  wrappedDispatch = (...args) => callFnWithEffects(() => store.dispatch(...args));

  return {
    ...store,
    dispatch: wrappedDispatch,
    // We must not forgot about mandatory sagaRepository & effectExecutor
    // even when reducer is replaced
    replaceReducer: nextReducer => store
      .replaceReducer((appState, action) =>
        nextReducer(appState, { ...action, sagaRepository, effectExecutor }))
  };
};
