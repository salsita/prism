## Using Public Interface

One last thing that we are missing is the implementation of the "Load Both!" button. We'd like to start fetching both `GifViewer`s when the user clicks the button. We've exposed the `fetchGif` function as the public interface of `GifViewer`, so this should be relatively easy. We just need to write saga which translates `Load` action to `RequestMore` for each instance of `GifViewer`.

```javascript
import { Updater, wrapAction } from 'redux-elm';
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import gifViewerUpdater, { init as gifViewerInit, requestMore } from '../gif-viewer/updater';

const initialModel = {
  top: gifViewerInit('funny cats'),
  bottom: gifViewerInit('funny dogs')
};

function* fetchAll() {
  yield put(wrapAction(requestMore(), 'Top'));
  yield put(wrapAction(requestMore(), 'Bottom'));
}

function* saga() {
  yield* takeEvery('Load', fetchAll);
}

export default new Updater(initialModel, saga)
  .case('Top', (model, action) =>
    ({ ...model, top: gifViewerUpdater(model.top, action) }))
  .case('Bottom', (model, action) =>
    ({ ...model, bottom: gifViewerUpdater(model.bottom, action) }))
  .toReducer();
```

As you can see, Saga dispatches tagged `RequestMore` actions for every `Load` action it receives. What we just need to do is address the Action to corresponding Component instance (Top, Bottom) and we do so by using `wrapAction` which is a helper function provided by `redux-elm`.
