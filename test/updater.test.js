import { assert } from 'chai';

import Updater from '../src/Updater';
import unwrapMatcher from '../src/matchers/unwrapMatcher';
import dynamicUnwrapMatcher from '../src/matchers/dynamicUnwrapMatcher';

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

  it('should require an updater in form of Generator function', () => {
    const updater = new Updater(0);

    updater.case('foobar', function*() {});

    try {
      updater.case('foobar', function() {});
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Provided updater must be a Generator function');
    }
  });

  it('should allow shipped-in exact matching', () => {
    const updater = new Updater(42);
    updater.case('Foo', function*(model) {
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
    updater.case('Foo', function*(model, action) {
      yield action.type;
      return model + 1;
    }, unwrapMatcher);

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
    updater.case('Foo', function*(model, action, baz) {
      yield baz + action.type;
      return model + 1;
    }, dynamicUnwrapMatcher);

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
    const falsyMatcher = () => () => false;

    const reducer = new Updater(42)
      .case('', function*() {}, falsyMatcher)
      .toReducer();

    assert.equal(reducer(undefined, {}).next().value, 42);
  });

  it('should call the updater when matcher matches action', () => {
    const truthyMatcher = () => () => ['foo'];

    const reducer = new Updater(0)
      .case('', function*() { return 42; }, truthyMatcher)
      .toReducer();

    assert.equal(reducer(undefined, {}).next().value, 42);
  });

  it('should', () => {
    const unwrappingMatcher = () => () => [0, 1, 2, 3];

    const reduction = new Updater(0)
      .case('', function*(model, action, first, second, third) {
        return first + second + third;
      }, unwrappingMatcher)
      .toReducer();

    assert.equal(reduction(undefined, {}).next().value, 6);
  });
});
