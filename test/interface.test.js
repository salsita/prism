import { assert } from 'chai';
import { sideEffect } from 'redux-side-effects';

import * as Interface from '../src/index';

import Updater from '../src/Updater';
import * as Matchers from '../src/matchers';
import forwardTo from '../src/forwardTo';
import mapEffects from '../src/mapEffects';
import * as Generators from '../src/generators';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Updater,
      Matchers,
      forwardTo,
      mapEffects,
      Generators,
      sideEffect
    });
  });
});
