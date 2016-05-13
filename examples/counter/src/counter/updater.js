import { Updater } from 'redux-elm';

const initialModel = 0;

export default new Updater(initialModel)
  .case('Increment', model => model + 1)
  .case('Decrement', model => model - 1)
  .toReducer();
