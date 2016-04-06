import { Updater, Matchers } from 'redux-elm';

const initialModel = 0;

export default new Updater(initialModel, Matchers.exactMatcher)
  .case('Increment', function*(model) {
    return model + 1;
  })
  .case('Decrement', function*(model) {
    return model - 1;
  })
  .toReducer();
