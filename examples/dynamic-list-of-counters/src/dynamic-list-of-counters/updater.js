import { Updater, Matchers, mapEffects, Generators } from 'redux-elm';
import counterUpdater, { init as counterInit } from '../counter/updater';

function* init() {
  return {
    counters: []
  };
};

export default new Updater(init)
  .case('Insert', function*(model) {
    return {
      ...model,
      counters: [
        ...model.counters,
        yield* mapEffects(counterInit(), 'Counter', model.counters.length)
      ]
    };
  }, Matchers.exactMatcher)
  .case('Remove', function*(model) {
    if (model.counters.length > 0) {
      const counters = [...model.counters];
      counters.pop();

      return {
        ...model,
        counters
      };
    } else {
      return model;
    }
  }, Matchers.exactMatcher)
  .case('Counter', function*(model, action, counterIndex) {
    const numericCounterIndex = parseInt(counterIndex, 10);

    return {
      ...model,
      counters: yield* Generators.map(model.counters, function*(counterModel, index) {
        if (index === numericCounterIndex) {
          return yield* mapEffects(counterUpdater(counterModel, action), 'Counter', index);
        } else {
          return counterModel;
        }
      })
    }
  }, Matchers.parameterizedMatcher)
  .toReducer();
