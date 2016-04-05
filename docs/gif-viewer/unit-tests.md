## Writing Unit Tests

We've got our first `redux-elm` Component implemented, let's write some unit tests. We'll not be testing our Views even though we could, but since all the business logic lies in Updaters it's not essential. Before starting working on any production app, you should consider how much code coverage is needed but generally we could say having unit tests for Updaters is enough, especially given the fact that all the Side effects are kept in Updaters along with Model mutations.

Before we got into writing some code a decent description of Component's behaviour should be clearly defined:

* It should display a loading indicator right after Component is initialized
* It should start loading a GIF right after Component is initialized where topic is funny cats
* It should not display loading indicator anymore when new GIF is fetched, instead newly fetched GIF should be displayed
* It should trigger loading of next GIF with selected topic and display loading indiciator right after user clicks Please More button

It's easy to convert described behaviour into Unit tests. Start by creating an empty folder called `gif-viewer` inside `test` folder. We'll have just single file holding all the Unit tests for the Updater, therfore create a new empty file called `updater.js` within `test/gif-viewer` folder.

```javascript
import { assert } from 'chai';

describe('GifViewer Updater Behaviour Description', () => {
  it('should contain null gifUrl right after Component is initialized', () => {
    assert.isTrue(false);
  });

  it('should yield a side effect to trigger loading some funny cat GIF right after Component is initialized', () => {
    assert.isTrue(false);
  });

  it('should replace gifUrl with newly provided url when NewGif kicks in', () => {
    assert.isTrue(false);
  });

  it('should yield a side effect to trigger loading a GIF with topic specified in model and null gifUrl when RequestMore kicks in', () => {
    assert.isTrue(false);
  });
});
```

As you might have spotted, we've translated some domain specific concepts into more concrete implementation concepts. Like for example we assume that `null` `gifUrl` means that we are showing a loading indicator in the UI. **You can try running failing tests by executing `npm run test:watch`**.

Writing Unit tests in `redux-elm` consists of two parts

1. Assert that Model was correctly mutated when specific Action is handled
2. Assert that Model yields expected Side Effects when specific Action is handled

### Deeper generator understanding

To understand how to write Unit tests we need to understand how Generators work, because our Updater is nothing else than Generator function.

```javascript
function* updater(model, action) {
  yield 1;
  yield 2;
  return model + 1;
}
```

Calling a generator does not return value but it returns [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators), think of an Object which has one method `next`:

```javascript
const iterator = updater(42, {type: 'SomeAction'});
```

Calling next on Iterator changes its internal state while returning the next element where element has always same shape:

```javascript
const nextElement = iterator.next();

console.log(nextElement); // nextElement is object with two fields, done and value where done is false for all the calls except the last one
                          // value contains either yielded or returned expression
                          //
                          // { done: false, value: 1 }

console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: true, value: 43 }
```

Now it's pretty obvious that testing our updater is just a matter of calling `next()` on the returned generator and expecting some values.

```javascript
function* updater(input) {
  yield 1;
  return input + 42;
}

const iterator = updater(12);

assert.deepEqual(iterator.next(), {
  done: false,
  value: 1
});

assert.deepEqual(iterator.next(), {
  done: true,
  value: 53
})
```

Let's have a look how we would write the first test which is testing correct State mutation:

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

`Updater` function always takes two arguments first is Model and second is Action because we are testing initial Model we provide `undefined` as Model and some `NonExistingAction` as second argument, we don't mind that Updater will not handle the action, we just need to provide **some** action so that Model gets initialized.

Now comes the nice part and it's testing of Side effects. **Updater does not execute any Side effect it only yields an intention to execute them in next execution frame** and the intetion is declarative `sideEffect` wrapper of the called function.

```javascript
  it('should yield a side effect to trigger loading some funny cat GIF right after Component is initialized', () => {
    const iterator = updater(undefined, { type: 'NonExistingAction' });

    // We know that there's an intention to fetch GIF parametrized by 'funny cats'
    assert.deepEqual(iterator.next(), {
      done: false,
      value: sideEffect(Effects.fetchGif, 'funny cats')
    });
  });
```

With fundamental knowledge writing two more remaining tests is trivial:

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