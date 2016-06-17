## Real Composition Example

We said that the Elm Architecture is about Composition and Encapsulation. Now let's have a closer look at how this works in practice.

So far the code we have seen looked very similiar to traditional Redux, except that we are using Sagas to deal with Side Effects. Imagine we have two programmers, one responsible for implementing the `GifViewer` Component and the other for a Component which shows a pair of `GifViewers` (let's call it `GifViewerPair`). `GifViewerPair` should be able to request fetching for both `GifViewers` at once. We'd like to use our colleague's implementation of `GifViewer` with the following interface:

```javascript
import gifViewerUpdater, {
  init,
  requestMore
} from '../gif-viewer/updater';

import GifViewer from '../gif-viewer/view';
```

`GifViewer` already contains `updater` and `init`. What it does not contain is `requestMore`, so we need to implement and expose it in `gif-viewer/updater.js`. Requesting new GIF is fundamentally just a matter of dispatching `RequestMore` action, so we just need to expose it. Add following line in `./gif-viewer/updater.js` file.

```javascript
export const requestMore = () => ({ type: 'RequestMore' });
```

`GifViewer` is now encapsulated and ready to be used by the `GifViewerPair` Component. Let's create a new folder in `redux-elm-skeleton` called `gif-viewer-pair` with two files, `updater.js` and `view.js`. Don't forget to change `main.js` to load the `GifViewerPair` as the Root Component.

```javascript
import run from './boilerplate';

import view from './gif-viewer-pair/view';
import updater from './gif-viewer-pair/updater';

run('app', view, updater);
```

Here comes the Composition part again. Defining the initial Model for the Updater.

```javascript
import { Updater } from 'redux-elm';
import { init } from '../gif-viewer/updater';

const initialModel = {
  top: init('funny cats'),
  bottom: init('funny dogs')
};

export default new Updater(initialModel).toReducer();
```

As its name suggests, `GifViewerPair` embeds two `GifViewers`: top and bottom. We mentioned that the parent Component was responsible for holding child Models, therefore the Model consist only of two fields, `top` and `bottom`, each holding a `GifViewer` initial model which we effectively created using `init` function.

What about the View? It looks like this:

```javascript
import React from 'react';
import { view } from 'redux-elm';

import GifViewer from '../gif-viewer/view';

export default view(({ model, dispatch }) => (
  <div>
    <GifViewer model={model.top} dispatch={dispatch} />
    <GifViewer model={model.bottom} dispatch={dispatch} />
    <br />
    <button onClick={() => dispatch({ type: 'Load' })}>Load Both!</button>
  </div>
));
```

Again, nothing but Composition. Just render two `GifViewers` and provide the corresponding Model instance. The top `GifViewer` gets `model.top` and the Bottom gets `model.bottom`. We also provide a `dispatch` property. When you are nesting Views, you **always need to pass two props: the Model and the dispatch function**.

You should be able to run the application now and see two `GifViewers`, but a lot of functionality is still missing.

![gif-viewer-pair-1](../../assets/7.png)
