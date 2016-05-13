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

  const callWithEffects = fn => {
    executeEffects = true;
    const result = fn();
    executeEffects = false;
    return result;
  };

  const effectExecutor = callback => {
    if (executeEffects) {
      setTimeout(() => {
        if (wrappedDispatch) {
          callback(wrappedDispatch);
        } else {
          console.warn(
            'There\'s been attempt to execute effects ' +
            'yet proper creating of store has not been finished yet'
          );
        }
      });
    }
  };

  callWithEffects(() => {
    store = createStore((appState, action) =>
      reducer(appState, { ...action, effectExecutor }), initialAppState);
  });

  wrappedDispatch = (...args) => callWithEffects(() => store.dispatch(...args));

  return {
    ...store,
    dispatch: wrappedDispatch
  };
};
