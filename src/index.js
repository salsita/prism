import { sideEffect } from 'redux-side-effects';

import Updater from './Updater';
import * as Generators from './generators';
import * as Matchers from './matchers';
import forwardTo from './forwardTo';
import mapEffects from './mapEffects';

export {
  Updater,
  Generators,
  Matchers,
  forwardTo,
  mapEffects,
  sideEffect
};
