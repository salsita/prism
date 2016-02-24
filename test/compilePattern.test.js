import { assert } from 'chai';

import compilePattern from '../src/compilePattern';

describe('compilePattern', () => {
  it('should be able to extract chunks', () => {
    let result;
    result = compilePattern('Static');

    assert.equal(result.chunks.length, 1);
    assert.equal(result.chunks[0].name, 'Static');
    assert.isFalse(result.chunks[0].dynamic);

    result = compilePattern('[Dynamic]');

    assert.equal(result.chunks.length, 1);
    assert.equal(result.chunks[0].name, 'Dynamic');
    assert.isTrue(result.chunks[0].dynamic);

    result = compilePattern('Static.[Dynamic]');

    assert.equal(result.chunks.length, 2);
    assert.equal(result.chunks[0].name, 'Static');
    assert.isFalse(result.chunks[0].dynamic);
    assert.equal(result.chunks[1].name, 'Dynamic');
    assert.isTrue(result.chunks[1].dynamic);

    result = compilePattern('Static.[Dynamic].Static2');

    assert.equal(result.chunks.length, 3);
    assert.equal(result.chunks[0].name, 'Static');
    assert.isFalse(result.chunks[0].dynamic);
    assert.equal(result.chunks[1].name, 'Dynamic');
    assert.isTrue(result.chunks[1].dynamic);
    assert.equal(result.chunks[2].name, 'Static2');
    assert.isFalse(result.chunks[2].dynamic);
  });

  it('should not allow to provide invalid pattern', () => {
    const testPattern = pattern => {
      try {
        compilePattern(pattern);
        assert.isTrue(false);
      } catch (ex) {
        assert.equal(ex.message, 'Invalid pattern provided');
      }
    };

    testPattern(1);
    testPattern(0);
    testPattern(false);
    testPattern(true);
    testPattern({});
    testPattern(new Date());
    testPattern();
    testPattern('.');
    testPattern('Static[.[Dynamic].Static2');
    testPattern('Static.[[Dynamic]].Static2');
    testPattern('');
    testPattern('Static.');
    testPattern('[Dynamic].');
  });
});
