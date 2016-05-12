import { assert } from 'chai';

import * as Interface from '../src/index';

import Updater from '../src/Updater';
import * as Matchers from '../src/matchers';
import forwardTo from '../src/forwardTo';
import storeEnhancer from '../src/storeEnhancer';
import view from '../src/view';
import wrapAction from '../src/wrapAction';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Updater,
      Matchers,
      forwardTo,
      view,
      wrapAction,
      default: storeEnhancer
    });
  });
});
