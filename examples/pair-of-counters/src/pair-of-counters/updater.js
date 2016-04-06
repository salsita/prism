import { Updater, Matchers } from 'redux-elm';
import counterUpdater, { init as counterInit } from '../counter/updater';

function* init() {
  return {
    topCounter: yield* counterInit(),
    bottomCounter: yield* counterInit()
  };
};

export default new Updater(init)
  .case('Reset', init, Matchers.exactMatcher)
  .case('TopCounter', function*(model, action) {
    return {
      ...model,
      topCounter: yield* counterUpdater(model.topCounter, action)
    };
  })
  .case('BottomCounter', function*(model, action) {
    return {
      ...model,
      bottomCounter: yield* counterUpdater(model.bottomCounter, action)
    };
  })
  .toReducer();
