import unwrap from './unwrap';

/**
 * Returns reducer enhanced with `case` function which registers updater
 * for specific pattern. It's unwrapping the action automatically.
 *
 * @param {any} Initial model
 *
 * @return {Function} Enhanced reducer
 */
export default initialModel => {
  const updaters = [];

  const reducer = (model = initialModel, action) => {
    if (action) {
      return updaters.reduce((partialModel, { updater, compiledUnwrap }) => {
        const unwrappedAction = compiledUnwrap(action);

        if (unwrappedAction) {
          return updater(partialModel, unwrappedAction);
        } else {
          return partialModel;
        }
      }, model);
    } else {
      return model;
    }
  };

  reducer.case = (pattern, updater) => {
    updaters.push({
      updater,
      compiledUnwrap: unwrap(pattern)
    });

    return reducer;
  };

  return reducer;
};
