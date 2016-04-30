## Writing Unit Tests

Now that we've implemented our first `redux-elm` Component, let's write some unit tests. We could test our Views, but this isn't essential since the Updates contain all the business logic. Before you start working on a production app, you should consider how much code coverage is needed. Generally we feel that having unit tests for Updaters is enough, especially given the fact that all the Side Effects are yielded and all Model mutations occur in Updaters.

Before writing tests, the Component's behaviour should be clearly defined:

* It should display a loading indicator right after the Component is initialized
* It should start loading a GIF after initialization with the topic "funny cats"
* When a new GIF has been fetched, it should be displayed instead of the loading indicator
* It should trigger loading of a new GIF with the selected topic and display the loading indiciator right after the user clicks the "More Please" button

It's easy to translate the described behaviour into unit tests. Start by creating an empty folder called `gif-viewer` inside the `test` folder. We'll have just a single file holding all the unit tests for the Updater, so create a new empty file called `updater.js` within the `test/gif-viewer` folder.

```javascript
import { assert } from 'chai';

describe('GifViewer Updater Behaviour Description', () => {
  it('should contain null gifUrl right after Component is initialized', () => {
    assert.isTrue(false);
  });

  it('should yield a side effect to trigger loading some funny cat GIF right after Component is initialized', () => {
    assert.isTrue(false);
  });

  it('should replace gifUrl with newly provided url when NewGif is handled', () => {
    assert.isTrue(false);
  });

  it('should yield a side effect to trigger loading a GIF with topic specified in model and null gifUrl when RequestMore is handled', () => {
    assert.isTrue(false);
  });
});
```

As you may have noticed, we've translated some domain specific concepts into more concrete implementation concepts. For example, we assume that a `null` `gifUrl` means that we are showing a loading indicator. **You can try running the tests by executing `npm run test:watch`**.

Writing unit tests in `redux-elm` consists of two parts:

1. Assert that the Model was correctly mutated when a specific Action is handled
2. Assert that Model yields expected Side Effects when specific Action is handled

### Understanding Generators

To understand how to write unit tests, we need to understand how Generators work, since our Updater is nothing other than a Generator function.

```javascript
function* updater(model, action) {
  yield 1;
  yield 2;
  return model + 1;
}
```

Calling a Generator does not return a value but rather an [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators). This is basically an object with a single `next` method:

```javascript
const iterator = updater(42, {type: 'SomeAction'});
```

Calling `next` on an Iterator returns the next element, which always has the same shape:

```javascript
const nextElement = iterator.next();

console.log(nextElement); // nextElement is an object with two fields, `done` and `value`, where `done` is false for all the calls except the last one
                          // `value` contains an expression that has been `yield`ed or `return`ed
                          //
                          // { done: false, value: 1 }

console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: true, value: 43 }
```

Testing our Updater is just a matter of calling `next()` on the returned Generator and verifying that the expected values are returned.

```javascript
function* updater(input) {
  yield 1;
  return input + 42;
};

const iterator = updater(12);

assert.deepEqual(iterator.next(), {
  done: false,
  value: 1
});

assert.deepEqual(iterator.next(), {
  done: true,
  value: 53
});
```

### Our First Tests

Let's have a look at how we would write the first test, which tests for correct State mutation:

```javascript
import { assert } from 'chai';
import updater from '../../src/gif-viewer/updater';

describe('GifViewer Updater Behaviour Description', () => {
  it('should contain null gifUrl right after Component is initialized', () => {
    const iterator = updater(undefined, { type: 'NonExistingAction' });

    // We ignore result of first `next()` call because we know
    // that first value yielded in the updater is Side Effect
    iterator.next();

    // Second call of `iterator.next()` will return appropriate mutated Model
    assert.equal(iterator.next().value.gifUrl, null);
  });
});
```

The `Updater` function always takes two arguments: the Model and the Action. Because we are testing the initial Model, we provide `undefined` as the Model and some `NonExistingAction` as second argument. We don't mind that the Updater will not handle the Action, we just need to provide *some* action so that the Model gets initialized.

Now comes the nice part: testing of Side Effects. **The Updater does not execute any Side Effects, it just yields an intention to execute them in next execution frame**. The intention is expressed using the declarative `sideEffect` wrapper.

```javascript
import { assert } from 'chai';
import { sideEffect } from 'redux-side-effects';

import updater from '../../src/gif-viewer/updater';
import * as Effects from '../../src/gif-viewer/effects';

  it('should yield a side effect to trigger loading some funny cat GIF right after Component is initialized', () => {
    const iterator = updater(undefined, { type: 'NonExistingAction' });

    // We know that there's an intention to fetch GIF parameterized by 'funny cats'
    assert.deepEqual(iterator.next(), {
      done: false,
      value: sideEffect(Effects.fetchGif, 'funny cats')
    });
  });
```

With our new-found knowledge, writing the two remaining tests is trivial:

```javascript
  it('should replace gifUrl with newly provided url when NewGif kicks in', () => {
    const url = 'newlyfetchedUrl';
    const initialModel = {
      topic: 'funny cats',
      url: 'foobar'
    };

    const iterator = updater(initialModel, {
      type: 'NewGif',
      url
    });

    assert.deepEqual(iterator.next(), {
      done: true,
      value: {
        ...initialModel,
        gifUrl: url
      }
    });
  });

  it('should yield a side effect to trigger loading a GIF with topic specified in model and null gifUrl', () => {
    const initialModel = {
      topic: 'special topic',
      url: 'foobar'
    };

    const iterator = updater(initialModel, {
      type: 'RequestMore'
    });

    // Testing that Updater yields appropriate side effect
    assert.deepEqual(iterator.next(), {
      done: false,
      value: sideEffect(Effects.fetchGif, initialModel.topic)
    });

    // Testing model mutation, gifUrl must be null
    assert.deepEqual(iterator.next(), {
      done: true,
      value: {
        ...initialModel,
        gifUrl: null
      }
    });
  });
```