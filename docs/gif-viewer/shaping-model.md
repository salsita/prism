## Defining the Initial Model

The shape of the Model is fairly simple: it needs just two fields, `topic` and `gifUrl`. Because we want to be able to configure the topic externally, we'll create our initial model with a parametrizable `init` function.

```javascript
import { Updater } from 'redux-elm';

export const init = topic => ({
  topic,
  gifUrl: null
});

export default new Updater(init('funny cats'))
  .toReducer();

```

Now imagine that we'll have a parent component which handles the initialization of many GifViewers instances. The parent component could use the exported `init` function to build a initial model with specific topic. We will cover this in later examples.

Right now, we just need to call the `init` function to get an initial Model for the Component. In this example, we want to have the initial model parameterized with the topic "funny cats".
