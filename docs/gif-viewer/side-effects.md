## Side Effects in Practice

You have probably realized that Updater is basically a function which somehow mutates a Model based on User interaction, while View projects the Model onto screen. Important condition is that Updater must not yield any side effect. In other words, **Updater is just a pure function which responsibility is only returning new reference to mutated model**, the function must be synchronous and can't modify anything outside the function scope. You can call the function more than once, guaranteeing that given the same input, the same output is always produced and nothing outside the function is touched. Let's take function `sin` for instance:

```javascript
console.log(Math.sin(Math.PI / 2));
console.log(Math.sin(Math.PI / 2));

Console:
1
1
```

You can be sure that the `value` will always be 1 no matter how many times you call the function. However let's consider impure function:

```javascript
const impureSin = (value) => {
  console.log('impurity');

  return Math.sin(value);
}

console.log(impureSin(Math.PI / 2));
console.log(impureSin(Math.PI / 2));

Console:
1
impurity
1
impurity
```

As you can see, calling actual `Math.sin` function does not change state of the application, however calling `impureSin` changes the state of the application since it logs word "impurity".

Consider more realistic example:

```javascript
const incrementUpdater = model => {
  $.ajax('/increment');
  
  return model + 1;
}
```

Calling an XHR in Updater is an impure operation and you should never do so. Updater is called always when UI dispatches an action, however in modern UI development we want to have features like Hot reloading or time travel and this would not be possible if our Updaters weren't pure since technically hot realoding means that application keeps track of all the dispatched actions and once code changes all the actions get re-applied onto new hot-reloaded implementation of Updaters. However, in our particular case this would mean that number of increments on the server would not correspond with number on the client.

An application without side effects would be useless, because you wouldn't have a chance how to load data from API, trigger some asynchronous actions or for example log into the console.

This is exactly our case in GifViewer applicaton, as you can see, there's not much going on now. We can just see the loading spinner, and nothing happens if we click on the button. Ideally we'd like our application to initiate loading of the GIF right after Component is initialized.

First of all, we need to define an Effect that triggers the API call. Let's create a new file within the `gif-viewer` directory and call it `effects.js`. This file will contain a single function called `fetchGif`:

```javascript
require('isomorphic-fetch');

export const fetchGif = topic => fetch(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`)
  .then(response => {
    if (response.status > 400) {
      throw new Error('Error while fetching from the server');
    } else {
      return response.json();
    }
  })
  .then(body => body.data.image_url);
```

We will be using `isomorphic-fetch` for XHR request, which needs to be installed by running the following command:

```
npm install --save isomorphic-fetch
```

Our `fetchGif` function takes `topic` as argument. Inside the function we just need to trigger the XHR request and return Promise which resolves with response, in our case it means new GIF url.

Let's open `updater.js` again and make a slight modification to our `init` function:

```javascript
import { sideEffect } from 'redux-side-effects';
import * as Effects from './effects';

export function init(topic) {
  return function*() {
    yield sideEffect(Effects.fetchGif, topic);

    return {
      topic,
      gifUrl: null
    };
  };
};

```

We are utilizing the full power of Generators here, yielding a `fetchGif` Side Effect in our `init` function. Yielding Side Effects is as easy as yielding an Effect wrapped in the `sideEffect` function exposed by the `redux-side-effects` library. Since a declarative approach for Effects, unit testing is a breeze.

We can declare any Side Effect by calling the following function:

```javascript
yield sideEffect(effectFunction, arg1, arg2, arg3....);
```

`redux-side-effects` will automatically take care of Effect execution while passing in `dispatch` and any additional arguments. In other words, it will call `effectFunction` with the arguments `dispatch`, `arg1`, `arg2`, `arg3`, etc.

```javascript
const effectFunction = (dispatch, arg1, arg2, arg3) => {
  // Side Effect implementation
}
```

Even though the API is being called now, we still can't see anything in the UI because we are not handling the `NewGif` Action in the Updater. We need to update the Model with the appropriate `gifUrl` when the `NewGif` Action is dispatched so that the View is re-rendered with the newly fetched GIF:

```javascript
export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    };
  })
  .toReducer();

```

In the `fetchGif` Effect we dispatch the `NewGif` Action with the `url` of the GIF. We just need to handle this Action in Updater and mutate the Model appropriately. In this case, this means that we change the `gifUrl` field of the model to `action.url`. Now you should be able to see a GIF after refreshing the application:

![gif-viewer-2](../assets/6.png)

The last mandatory requirement for our GifViewer is that when the user clicks the "More Please!" button, it should fetch a new GIF. Currently, however, nothing happens when the button is clicked. To add this functionality, we just need to define what should happen when `RequestMore` is dispatched. `RequestMore` is an Action that is dispatched when the button is clicked.

```javascript
export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    };
  })
  .case('RequestMore', function*(model, action) {
    yield sideEffect(Effects.fetchGif, model.topic);

    return {
      ...model,
      gifUrl: null
    };
  })
  .toReducer();
```

We can re-use the `fetchGif` Effect that we have already implemented. The topic is retrieved from the Model, we again set `gifUrl` to `null` so that the loading indicator is displayed in the UI. The application is now fully implemented.