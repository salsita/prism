import { assert } from 'chai';

import Updater from '../src/Updater';
import Matcher from '../src/matchers/Matcher';

class MockMatcher extends Matcher {
  constructor(value) {
    super();
    this.value = value;
  }

  match(action) {
    if (action.type === this.value) {
      return [ this.value, this.value ];
    } else {
      return false;
    }
  }
}

describe('Updater interface', () => {
  it('should not allow to pass plain old init function', () => {
    try {
      new Updater(() => {}); // eslint-disable-line no-new
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Init can\'t be just a function, it must be Generator');
    }
  });

  it('should be allowed to provide init object', () => {
    const initObject = {};
    const updater = new Updater(initObject);
    const reducer = updater.toReducer();
    assert.equal(reducer(undefined, {}).next().value, initObject);
  });

  it('should be allowed to provide primitive data type init value', () => {
    const initValue = 24;
    const updater = new Updater(initValue);
    const reducer = updater.toReducer();
    assert.equal(reducer(undefined, {}).next().value, initValue);
  });

  it('should be allowed to provide init function in form of Generator', () => {
    function* init() {
      yield 42;
      return 24;
    }

    const updater = new Updater(init);
    const reducer = updater.toReducer();
    const iterable = reducer(undefined, {});

    assert.deepEqual(iterable.next(), {
      value: 42,
      done: false
    });

    assert.deepEqual(iterable.next(), {
      value: 24,
      done: true
    });
  });

  it('should be allowed to register new Matcher', () => {
    function* updater(model, action) {
      return action.type;
    }

    const reducer = new Updater(0)
      .registerMatcher(new MockMatcher('foobar'), updater)
      .toReducer();

    const iterable = reducer(undefined, {type: 'foobar'});
    assert.deepEqual(iterable.next(), {
      done: true,
      value: 'foobar'
    });
  });

  it('should require valid instance of Matcher and updater in form of Generator function', () => {
    const updater = new Updater(0);

    updater.registerMatcher(new MockMatcher('foobar'), function*() {});

    try {
      updater.registerMatcher(new MockMatcher('foobar'));
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Provided updater must be a Generator function');
    }

    try {
      updater.registerMatcher(new MockMatcher('foobar'), () => {});
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Provided updater must be a Generator function');
    }

    try {
      updater.registerMatcher();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Provided matcher is not instance of Matcher');
    }
  });

  it('should allow shipped-in exact matching', () => {
    const updater = new Updater(42);
    updater.caseExact('Foo', function*(model) {
      return model + 1;
    });

    const reducer = updater.toReducer();

    let state = undefined;

    state = reducer(state, { type: 'Foo.Bar' }).next().value;
    assert.equal(state, 42);

    state = reducer(state, { type: 'Foo' }).next().value;
    assert.equal(state, 43);
  });

  it('should allow shipped-in matching with unwrapping', () => {
    const updater = new Updater(42);
    updater.caseUnwrap('Foo', function*(model, action) {
      yield action.type;
      return model + 1;
    });

    const reducer = updater.toReducer();

    let state = undefined;
    state = reducer(state, { type: 'Foo' }).next().value;
    assert.equal(state, 42);

    const reduction = reducer(state, { type: 'Foo.Bar' });
    assert.deepEqual(reduction.next(), {
      done: false,
      value: 'Bar'
    });

    assert.deepEqual(reduction.next(), {
      done: true,
      value: 43
    });
  });

  it('should allow shipped-in matching with dynamic unwrapping', () => {
    const updater = new Updater(42);
    updater.caseDynamicUnwrap('Foo', function*(model, action, baz) {
      yield baz + action.type;
      return model + 1;
    });

    const reducer = updater.toReducer();

    let state = undefined;
    state = reducer(state, { type: 'Foo' }).next().value;
    assert.equal(state, 42);

    const reduction = reducer(state, { type: 'Foo.Bar.Baz' });
    assert.deepEqual(reduction.next(), {
      done: false,
      value: 'BarBaz'
    });

    assert.deepEqual(reduction.next(), {
      done: true,
      value: 43
    });
  });
});

describe('Converting Updater to Reducer', () => {
  it('should return initial reduction if there\'s no matcher matching action', () => {
    class FalsyMatcher extends Matcher {
      match() {
        return false;
      }
    }

    const reducer = new Updater(42)
      .registerMatcher(new FalsyMatcher(), function*() {})
      .toReducer();

    assert.equal(reducer(undefined, {}).next().value, 42);
  });

  it('should call the updater when matcher matches action', () => {
    class TruthyMatcher extends Matcher {
      match() {
        return ['foo'];
      }
    }

    const reducer = new Updater(0)
      .registerMatcher(new TruthyMatcher(), function*() { return 42; })
      .toReducer();

    assert.equal(reducer(undefined, {}).next().value, 42);
  });

  it('should', () => {
    class UnwrappingMatcher extends Matcher {
      match() {
        return [0, 1, 2, 3];
      }
    }

    const reduction = new Updater(0)
      .registerMatcher(new UnwrappingMatcher(), function*(model, action, first, second, third) {
        return first + second + third;
      })
      .toReducer();

    assert.equal(reduction(undefined, {}).next().value, 6);
  });
});
