## Using Public Interfaces

One last thing that we are missing is the implementation of the "Load Both!"" button. We'd like to start fetching both `GifViewer`s when the user clicks the button. We've exposed the `fetchGif` function as the public interface of `GifViewer`, so this should be relatively easy. Let's start by writing the handler for the `Load` Action.

```javascript
import { Updater, mapEffects, Matchers } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit } from '../gif-viewer/updater';

const funnyCatsGifViewerInit = gifViewerInit('funny cats');
const funnyDogsGifViewerInit = gifViewerInit('funny dogs');

export function* init() {
  return {
    top: yield* mapEffects(funnyCatsGifViewerInit(), 'Top'),
    bottom: yield* mapEffects(funnyDogsGifViewerInit(), 'Bottom')
  };
};

export default new Updater(init)
  .case('Top', function*(model, action) {
    return {
      ...model,
      top: yield* mapEffects(gifViewerUpdater(model.top, action), 'Top')
    };
  })
  .case('Bottom', function*(model, action) {
    return {
      ...model,
      bottom: yield* mapEffects(gifViewerUpdater(model.bottom, action), 'Bottom')
    };
  })
  .case('Load', function*(model, action) {
    return model;
  }, Matchers.exactMatcher) // `exactMatcher` is mandatory here otherwise `matcher` would be used and the action would never be matched since it does not contain any sub-Action
  .toReducer();
```

The only tricky part is that you need to provide a handler-specific Matcher. This is the third argument of the `case` method. Because we have not overridden the default Matcher used by the Updater, `matcher` is used by default. We need to override this because `Load` is a leaf Action so the type must be matched exactly, without any unwrapping.

Model mutation is fairly simple. We just need to use the public interface exposed by `GifViewer`, which is a single function (`fetchGif`). The function must be called to mutate the model of both GifViewers:

```javascript
import { Updater, mapEffects, Matchers } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit, fetchGif } from '../gif-viewer/updater';

const funnyCatsGifViewerInit = gifViewerInit('funny cats');
const funnyDogsGifViewerInit = gifViewerInit('funny dogs');

export function* init() {
  return {
    top: yield* mapEffects(funnyCatsGifViewerInit(), 'Top'),
    bottom: yield* mapEffects(funnyDogsGifViewerInit(), 'Bottom')
  };
};

export default new Updater(init)
  .case('Top', function*(model, action) {
    return {
      ...model,
      top: yield* mapEffects(gifViewerUpdater(model.top, action), 'Top')
    };
  })
  .case('Bottom', function*(model, action) {
    return {
      ...model,
      bottom: yield* mapEffects(gifViewerUpdater(model.bottom, action), 'Bottom')
    };
  })
  .case('Load', function*(model, action) {
    return {
      ...model,
      top: yield* mapEffects(fetchGif(model.top), 'Top'),
      bottom: yield* mapEffects(fetchGif(model.bottom), 'Bottom')
    };
  }, Matchers.exactMatcher)
  .toReducer();
```
