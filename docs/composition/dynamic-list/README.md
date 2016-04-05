## Dynamic List of Components

We know how Composition works and why it's essential for `redux-elm` so we can try to build an example which is a bit more realistic. This tutorial guides you through process of implementing dynamic list of `GifViewer`s. User will be allowed to dynamically add infinite number of `GifViewer`s with specified topics.

![gif-viewer-list-1](../../assets/12.png)

After we create a new folder `gif-viewer-list` inside `src` with `updater.js` and view.js` files, we shouldn't forget about updating the Root component in `main.js`:

```javascript
import run from './boilerplate';

import view from './gif-viewer-list/view';
import updater from './gif-viewer-list/updater';

run('app', view, updater);
``` 

Let's shape out initial model, we know that there will be list of child `GifViewer` components and we also need to keep `topic` because it will correspond with value provided by Input element.

```javascript
import { Updater } from 'redux-elm';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .toReducer();

```

We should prepare the View now:

```javascript
import React from 'react';
import { forwardTo } from 'redux-elm';

import GifViewer from '../gif-viewer/view';

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

export default ({ model, dispatch }) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={model.topic}
      onKeyDown={ev => ev.keyCode === 13 ? dispatch({ type: 'Create' }) : null}
      onChange={ev => dispatch({ type: 'ChangeTopic', value: ev.target.value })}
      style={inputStyle} />
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {model.gifViewers.map((gifViewerModel, index) =>
        <GifViewer key={index} model={gifViewerModel} dispatch={forwardTo(dispatch, 'GifViewer', index)} />)}
    </div>
  </div>
);
```

Input element just renders value `topic` provided by model. User can change its value by dispatching `ChangeTopic` action, after hitting Return (Enter) key `Create` is dispatched because that's what we want to happen. It should create a new `GifViewer` Component in the Model given the `topic`.

`gifViewers` is array holding all the models for dynamic list of `GifViewers` it just needs to be mapped to `GifViewer` component passing the Model slice. We want to wrap all the actions by `GifViewer.Index` and we used `forwardTo` function:

```javascript
dispatch={forwardTo(dispatch, 'GifViewer', index)}
```

For example when `NewGif` is dispatched in second `GifViewer` the action will be wrapped to `GifViewer.1.NewGif`.