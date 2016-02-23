import unwrap from './unwrap';

export default initialModel => {
  const updaters = [];

  const reducer = (model = initialModel, action) => {
    if (action) {
      return updaters.reduce((partialModel, { updater, pattern }) => {
        const unwrappedAction = unwrap(action, pattern);

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
      pattern,
      updater
    });

    return reducer;
  };

  return reducer;
};
