import { assert } from 'chai';

import * as Interface from '../src/index';

import Updater from '../src/Updater';
import * as Matchers from '../src/matching/matchers';
import * as Sagas from '../src/sagas';
import * as Actions from '../src/actions';
import forwardTo from '../src/forwardTo';
import storeEnhancer from '../src/storeEnhancer';
import view from '../src/view';
import wrapAction from '../src/wrapAction';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Updater,
      Matchers,
      Sagas,
      Actions,
      forwardTo,
      view,
      wrapAction,
      default: storeEnhancer
    });
  });
});
