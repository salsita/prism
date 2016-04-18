## Real Composition Example

We said that the Elm Architecture is about Composition and Encapsulation and now let's have a look why because so far the code looked very similiar to what it would look like using traditional `redux` except we are using Generators to effectively solve Side Effects. Imagine we have two programmers, one is responsible for implementing `GifViewer` component and we are responsible for Component which shows pair of `GifViewers` let's call it `GifViewerPair`. `GifViewerPair` should also be able to request fetching for both `GifViewers` at once. Therefore we'd like to use implementation of our collegue who implemented `GifViewer` with following interface:

```javascript
import gifViewerUpdater, {
  init as gifViewerInit,
  fetchGif
} from '../gif-viewer/updater';

import GifViewer from '../gif-viewer/view';
```

`GifViewer` already contains `gifViewerUpdater` and `gifViewerInit` what it does not contain is `fetchGif` so we need to implement and expose it in our `gif-viewer/updater.js` file. We actually have it implemented already we just need to export it:

```javascript
export function* fetchGif(model) {
  yield sideEffect(Effects.fetchGif, model.topic);

  return {
    ...model,
    gifUrl: null
  };
};

export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    };
  })
  .case('RequestMore', fetchGif)
  .toReducer();
```

So instead of anonymous function which handles `RequestMore` action, we'll turn it into named function `fetchGif` and `export` it so that the function can be used externally. `GifViewer` is now encapsulated and ready to be used in our `GifViewerPair` application. Let's create new folder in our `redux-elm-skeleton` and call it `gif-viewer-pair` with two files `updater.js` and `view.js`, do not forget to change `main.js` to load our `GifViewerPair` as Root Component.

```javascript
import run from './boilerplate';

import view from './gif-viewer-pair/view';
import updater from './gif-viewer-pair/updater';

run('app', view, updater);
```

Here comes the Composition part again, let's define our Initial model for Updater.

```javascript
import { Updater } from 'redux-elm';

const initialModel = {
  top: {},
  bottom: {}
};

// Matcher is not provided here! We'll explain why later
export default new Updater(initialModel).toReducer();
```

As its name suggests `GifViewerPair` embeds two `GifViewers`, top and bottom and we said that Parent component was responsible for holding Child models, therefore our Model consist only from two fields `top` and `bottom` each holds `GifViewer` model. What about View?

```javascript
import React from 'react';

import GifViewer from '../gif-viewer/view';

export default ({ model, dispatch }) => (
  <div>
    <GifViewer model={model.top} dispatch={dispatch} />
    <GifViewer model={model.bottom} dispatch={dispatch} />
    <br />
    <button onClick={() => dispatch({ type: 'Load' })}>Load Both!</button>
  </div>
);
```

Again, nothing but Composition, just render two `GifViewers` and provide corresponding Model instance. Top `GifViewer` gets `model.top` and Bottom gets `model.bottom` and as you can see we also provide `dispatch`. When you are nesting Views you **always need to pass two props: model and dispatch function**.

You should be able to run the application now and see two `GifViewers` but nothing really works.

![gif-viewer-pair-1](../../assets/7.png)