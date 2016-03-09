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
      return updaters.reduce((partialModel, { updater, compiledUnwrap, pattern }) => {
        if (compiledUnwrap) {
          const unwrappedAction = compiledUnwrap(action);

          if (unwrappedAction && (unwrappedAction.type !== '' || action.type === pattern)) {
            return updater(partialModel, { ...unwrappedAction, match: unwrappedAction.match[pattern] });
          } else {
            return partialModel;
          }
        } else {
          if (pattern === action.type) {
            return updater(partialModel, action);
          } else {
            return partialModel;
          }
        }
      }, model);
    } else {
      return model;
    }
  };

  reducer.case = (pattern, updater) => {
    updaters.push({
      updater,
      compiledUnwrap: unwrap(pattern),
      pattern
    });

    return reducer;
  };

  reducer.caseExact = (pattern, updater)=> {
    updaters.push({
      updater,
      pattern
    });

    return reducer;
  };

  return reducer;
};
