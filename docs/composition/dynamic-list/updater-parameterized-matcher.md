## Updater with `parameterizedMatcher`

All Actions relating to a specific instance of `GifViewer` must be prepended with `GifViewer` following by the index of the Component in the list. That is where `parameterizedMatcher` comes in handy:

```javascript
import { Updater, Matchers } from 'redux-elm';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    // We assume that the action starts with `GifViewer` and is followed by `gifViewerIndex`
    // `GifViewer.3.NewGif` will resolve in:
    //
    // gifViewerIndex = 3
    // action = { type: 'NewGif', url: 'some url' }

    // We need to parse `gifViewerIndex` because the matching is string-based
    // and all arguments are passed in as strings
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return model;
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

The implementation should be pretty straightforward. We just want to find the Model corresponding to the Component and call `gifViewerUpdater` with the unwrapped Action to perform the mutation. Here is a simplified version:

```javascript
import { Updater, Matchers } from 'redux-elm';

import gifViewerUpdater from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* model.gifViewers.map((gifViewerModel, index) => {
        if (index === numericGifViewerIndex) {
          return yield* gifViewerUpdater(gifViewerModel, action);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

We want to map over all the GifViewer models and find the one with the appropriate index. If the index matches then we call the child Updater (`gifViewerUpdater`) providing the Model slice and unwrapped action (`NewGif` or `RequestMore`). If the index does not match, we just return the original reference.

If you try to compile this now, you will get a syntax error since we are using `yield*` inside the `map` callback. This is because the callback is just a plain old JavaScript function, not a Generator function, and `yield*` can only be used inside Generators (think `function*` not `function`). So an easy fix would be to turn the anonymous function into an anonymous Generator function:

```javascript
import { Updater, Matchers } from 'redux-elm';

import gifViewerUpdater from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* model.gifViewers.map(function* (gifViewerModel, index) {
        if (index === numericGifViewerIndex) {
          return yield* gifViewerUpdater(gifViewerModel, action);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

Now you'll be able to compile the code, but it still won't work because [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) does not work with Generators. `redux-elm` provides a Generator-friendly version of `map` that is exported in the `Generators` namespace.

```javascript
import { Generators } from 'redux-elm';

function*() {
  // Everything will be yielded and returned as expected
  const mapped = yield* Generators.map([1, 2, 3], function*(value, index) {
    yield index + 1;
    return value + 1;
  });

  console.log(mapped); // [2, 3, 4]
}

```

We can use this function instead of plain old `Array.map`:

```javascript
import { Updater, Generators, Matchers } from 'redux-elm';

import gifViewerUpdater from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* Generators.map(model.gifViewers, function* (gifViewerModel, index) {
        if (index === numericGifViewerIndex) {
          return yield* gifViewerUpdater(gifViewerModel, action);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

There's one more issue with the above code: it does not explicitly call `mapEffects` for the sub-Updater (`gifViewerUpdater`). Don't forget that a sub-Updater may potentially `yield` some Side Effects that can dispatch new Actions. Those Actions need to be wrapped correctly:

```javascript
import { Updater, Generators, Matchers, mapEffects } from 'redux-elm';

import gifViewerUpdater from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* Generators.map(model.gifViewers, function* (gifViewerModel, index) {
        if (index === numericGifViewerIndex) {
          // We want to prepend all the dispacthed actions with `GifViewer.gifViewerIndex`
          return yield* mapEffects(gifViewerUpdater(gifViewerModel, action), 'GifViewer', gifViewerIndex);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

Good news: that was the hard part. Now comes the easy part. We just need to handle two more actions: `ChangeTopic` and `Create`, where `ChangeTopic` changes the `topic` property of the Model. We use `exactMatcher` for both of these actions since they are leaf Actions:

```javascript
import { Updater, Matchers, mapEffects, Generators } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit } from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('ChangeTopic', function*(model, action) {
    return {
      ...model,
      topic: action.value
    };
  }, Matchers.exactMatcher)
  .case('Create', function*(model) {
    return model;
  }, Matchers.exactMatcher)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* Generators.map(model.gifViewers, function* (gifViewerModel, index) {
        if (index === numericGifViewerIndex) {
          return yield* mapEffects(gifViewerUpdater(gifViewerModel, action), 'GifViewer', gifViewerIndex);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

So what should happen when the `Create` Action is dispatched? As its name suggests, the handler is responsible for creating a Model for a newly added `GifViewer`. So let's get the index of the new Model (this is equal to the length of `gifViewers`) and call the `init` function, which we create with the appropriate topic using `gifViewerInit`:

```javascript
import { Updater, Matchers, mapEffects, Generators } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit } from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('ChangeTopic', function*(model, action) {
    return {
      ...model,
      topic: action.value
    };
  }, Matchers.exactMatcher)
  .case('Create', function*(model) {
    const newModelIndex = model.gifViewers.length;
    const topicSpecificInitGifViewer = gifViewerInit(model.topic); // Provide topic which is currently in the model

    return {
      ...model,
      topic: '',
      gifViewers: [
        ...model.gifViewers,
        yield* mapEffects(topicSpecificInitGifViewer(), 'GifViewer', newModelIndex)
      ]
    };
  }, Matchers.exactMatcher)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    return {
      ...model,
      gifViewers: yield* Generators.map(model.gifViewers, function* (gifViewerModel, index) {
        if (index === numericGifViewerIndex) {
          return yield* mapEffects(gifViewerUpdater(gifViewerModel, action), 'GifViewer', gifViewerIndex);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

Hurray! We've implemented a fully functional list of `GifViewer`s:

![gif-viewer-list-2](../../assets/13.png)