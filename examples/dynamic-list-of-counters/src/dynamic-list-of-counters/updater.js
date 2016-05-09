import { Updater, Matchers } from 'redux-elm';
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater';


export default new Updater([])
  .case('Insert', model => [...model, counterInitialModel])
  .case('Remove', model => {
    if (model.length > 0) {
      const counters = [...model];
      counters.pop();

      return counters;
    } else {
      return model;
    }
  })
  .case('Counter', (model, action, ...rest) => {
    const numericCounterIndex = parseInt(action.args.param, 10);

    return model.map((counterModel, index) => {
      if (index === numericCounterIndex) {
        return counterUpdater(counterModel, action, ...rest);
      } else {
        return counterModel;
      }
    });
  }, Matchers.parameterizedMatcher)
  .toReducer();
