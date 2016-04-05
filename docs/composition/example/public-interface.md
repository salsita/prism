## Using public interface

One last thing that we are missing is implementation of Load Both! button. We'd like to start fetching of both GifViewers once user clicks the button. We've exposed `fetchGif` function as public interface of `GifViewer` so this should be relatively easy. Let's start by writing handler for `Load` Action.

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
}

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
  }, Matchers.exactMatcher) // exactMatcher is mandatory here otherwise Matcher would be used and the action wouldn't be ever matched because it does not contain any Sub Action
  .toReducer();
```

The only tricky part is that you need to provide handler specific Matcher, this is the third argument of `case` method. Because we have not specified Updater specific default Matcher, `matcher` implementation is used by default and we need to override this because `Load` does not contain any Sub Action, it's leaf Action so exact match of Action type is the only possible option.

Model mutation is fairly simple, we just need to use public interface exposed by `GifViewer` which is `fetchGif` function and the function must be called to mutate model for both GifViewers:

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
}

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
    }
  }, Matchers.exactMatcher)
  .toReducer();
```
