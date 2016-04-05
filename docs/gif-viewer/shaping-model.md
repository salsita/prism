## Shaping out initial Model

Shape of the model is fairly simple, it needs just two fields `topic` and `gifUrl` and because we want to be able to configure topic externally we'll turn our initial model into init function which can be parametrized. See that `init` is a function which returns a Generator function. The reason we did it this way is that `Updater` takes Generator function as argument and internally calls the function without arguments, so we need to pass those arguments in closure. In Functional Programming this is quite often technique and it's called [thunk function](https://en.wikipedia.org/wiki/Thunk).

```javascript
import { Updater, Matchers } from 'redux-elm';

export function init(topic) {
  return function*() {
    return {
      topic,
      gifUrl: null
    };
  };
};

export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .toReducer();

```

Now just imagine that we'll have a parent component which will handle initialization of many instances of GifViewers. The parent component could use the exported `init` function to build parameterized initial model which would then be just passed to GifViewer updater. We will cover this in next examples.

Right now, we just need to call the `init` function to create init generator which will create initial model for the Component and we want to have the initial model parametrized with topic 'funny cats'.
