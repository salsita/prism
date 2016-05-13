import { Updater } from 'redux-elm';
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater';

const initialModel = {
  topCounter: counterInitialModel,
  bottomCounter: counterInitialModel
};

export default new Updater(initialModel)
  .case('Reset', () => initialModel)
  .case('TopCounter', (model, ...rest) => ({ ...model, topCounter: counterUpdater(model.topCounter, ...rest) }))
  .case('BottomCounter', (model, ...rest) => ({ ...model, bottomCounter: counterUpdater(model.bottomCounter, ...rest) }))
  .toReducer();
