import { assert } from 'chai';

import * as Interface from '../src/index';

import Updater from '../src/Updater';
import * as Matchers from '../src/matchers';
import forwardTo from '../src/forwardTo';
import view from '../src/view';
import storeEnhancer from '../src/storeEnhancer';
import { Init } from '../src/actions';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Updater,
      Matchers,
      forwardTo,
      view,
      default: storeEnhancer,
      Init
    });
  });
});
