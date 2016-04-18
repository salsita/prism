import { Updater, Matchers } from 'redux-elm';

export function* init() {
  return 0;
}

export default new Updater(init, Matchers.exactMatcher)
  .case('Increment', function*(model) {
    return model + 1;
  })
  .case('Decrement', function*(model) {
    return model - 1;
  })
  .toReducer();
