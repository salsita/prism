export default createStore => (reducer, initialAppState) => {
  let store = null;
  const effectExecutor = callback =>
    setTimeout(() => callback(store ? store.dispatch : () => {}));

  store = createStore((appState, action) =>
      reducer(appState, action, effectExecutor), initialAppState);

  return store;
};
