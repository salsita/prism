## Defining the Initial Model

The shape of the Model is fairly simple: it needs just two fields, `topic` and `gifUrl`. Because we want to be able to configure the topic externally, we'll create our initial model with a parametrizable `init` function. Note that `init` is a function which returns a Generator function. The reason we did it this way is that `Updater` takes a Generator function as an argument and internally calls the function without parameters, so we need to pass those arguments in a closure. (In Functional Programming this is a common technique called a [thunk function](https://en.wikipedia.org/wiki/Thunk).)

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

Now imagine that we'll have a parent component which handles the initialization of many GifViewers instances. The parent component could use the exported `init` function to build a parameterized Generator function for each instance that would  be passed on to the GifViewer Updater. We will cover this in later examples.

Right now, we just need to call the `init` function to get a Generator that creates the initial Model for the Component. In this example, we want to have the initial model parameterized with the topic "funny cats".
