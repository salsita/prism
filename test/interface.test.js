import { assert } from 'chai';

import * as Interface from '../src/index';

import Matcher from '../src/matchers/Matcher';
import Updater from '../src/Updater';
import forwardTo from '../src/forwardTo';
import * as Generators from '../src/generators';

describe('Library interface', () => {
  it('should match exact interface', () => {
    assert.deepEqual(Interface, {
      Matcher,
      Updater,
      forwardTo,
      Generators
    });
  });
});
