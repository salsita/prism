## AJAX & Side Effects in practice

As you can see, there's not much going on now, we can just see infinite loading of Funny cats and after clicking the button nothing happens. We'd ideally want our application to initiate loading of GIF in the `init` generator function, but how can we do it? That's exactly when Side effects comes to play. First of all, we need to define implementation of side effect which triggers the API call. Let's create a new file within `gif-viewer` directory and call it `effects.js`. This file will only contain single function called `fetchGif`:

```javascript
import request from 'superagent-bluebird-promise';

export const fetchGif = (dispatch, topic) => {
  request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`)
    .then(response => dispatch({ type: 'NewGif', url: response.body.data.image_url }));
};
```

We will be using `superagent-bluebird-promise` which needs to be installed with its peer dependencies therefore run following command:

```
npm install --save bluebird superagent superagent-bluebird-promise
```

Every Effect function always take 1st argument which is `dispatch` and infinite number of optional arguments which are specific for the Effect. Therefore our `fetchGif` function takes `dispatch` and `topic` as arguments. Inside the function we just need to trigger the XHR request (we're using [superagent library](https://www.npmjs.com/package/superagent-bluebird-promise) in the example). Because we have `dispatch` function available, we can simply `dispatch` new action when API response arrives, providing `url` in the newly dispatched action, which is extracted from the API response. The function is now prepared to be yielded from our `init` function.

Let's open `updater.js` again and do slight modification in our `init` function:

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

It's obvious that we are utilizing full power of Generators here because, we are yielding Side Effect to `fetchGif` in our `init` function. `Yield`ing Side Effects is as easy as yielding Effect wrapped in `sideEffect` function, which is exposed by `redux-side-effects` library. Declarative approach is used, so that unit testing is a breeze.

We can abstract any Side Effect to calling following line:

```javascript
yield sideEffect(effectFunction, arg1, arg2, arg3....);
```

And `redux-side-effects` will automatically take care of effect execution while providing `dispatch` and all the arguments. In other words it will call your `effectFunction` with arguments `dispatch`, `arg1`, `arg2`, `arg3`...

```javascript
const effectFunction = (dispatch, arg1, arg2, arg3) => {
  // Side Effect execution implementation 
}
```

Even though API call is being called now we stil can't see anything in the UI and it's because we are not handling `NewGif` action in the Updater. We'd need to update the model with the `gifUrl` when `NewGif` action kicks in so that View would be re-rendered with newly fetched GIF. Let's change the Updater:

```javascript
export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    }
  })
  .toReducer();

```

In the `fetchGif` Effect we've dispatched `NewGif` action which provides `url` of the GIF and we only need to handle this action in Updater and mutate the Model appropriately, in our case we just need to change `gifUrl` field of the model to `action.url`. Now you should be able to see some GIF after refreshing the application:

![gif-viewer-2](../assets/6.png)

Last mandatory requirement for our GifViewer is that once user clicks the "More Please!" button, it should fetch new GIF however after clicking the button nothing happens. Adding this functionality is fairly simple, we just need to define what should happen when `RequestMore` is handled. `RequestMore` is action which is being dispatched after clicking the button.

```javascript
export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    }
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

In the implementation we can re-use effect for fetching GIF, which has already been implemented. Topic is provided from Model and we also set `gifUrl` to `null` which will cause loading indicator to display in the UI. The application should now be fully implemented.