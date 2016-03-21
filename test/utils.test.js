import { assert } from 'chai';

import * as Utils from '../src/utils';

describe('isFunction function', () => {
  it('should pass check when function is provided', () => {
    assert.isTrue(Utils.isFunction(() => {}));
  });

  it('should not pass check when function is not provided', () => {
    assert.isFalse(Utils.isFunction());
  });

  it('should not pass check when anything except function is provided', () => {
    assert.isFalse(Utils.isFunction(0));
    assert.isFalse(Utils.isFunction(null));
    assert.isFalse(Utils.isFunction({}));
    assert.isFalse(Utils.isFunction('function'));
  });
});

describe('isGenerator function', () => {
  it('should pass check when generator is provided', () => {
    assert.isTrue(Utils.isGenerator(function*() {}));
  });

  it('should not pass check when plain function is provided', () => {
    assert.isFalse(Utils.isGenerator(function() {}));
  });

  it('should not throw an exception when checking function throws exception', () => {
    assert.isFalse(Utils.isGenerator(() => {
      throw new Error;
    }));
  });

  it('should not pass check when anything except generator is provided', () => {
    assert.isFalse(Utils.isGenerator(null));
    assert.isFalse(Utils.isGenerator(0));
    assert.isFalse(Utils.isGenerator({}));
    assert.isFalse(Utils.isGenerator('generator'));
  });

});
