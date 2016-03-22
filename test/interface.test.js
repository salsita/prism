import { assert } from 'chai';

import * as Interface from '../src/index';

import Updater from '../src/Updater';
import * as Matchers from '../src/matchers';
import forwardTo from '../src/forwardTo';
import * as Generators from '../src/generators';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Updater,
      Matchers,
      forwardTo,
      Generators
    });
  });
});
