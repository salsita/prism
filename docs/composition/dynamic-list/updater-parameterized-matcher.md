## Updater with `parameterizedMatcher`

All Actions relating to a specific instance of `GifViewer` must be prepended with `GifViewer` following by the index of the Component in the list. Unfortunately this is a specific action unwrapping logic which can't be automatically handled by `redux-elm`, however `redux-elm` allows user to override default unwrapping behaviour by providing something called Matcher.

Default Matcher implementation is looking either for:

* exact match in action type with provided pattern: `Foo` unwraps to `Foo` or
* action type starting with provided pattern and rest is being unwrapped: `Foo.Bar` unwraps to `Bar`

However, `redux-elm` is shipped with `parameterizedMatcher` which serves exactly the purpose that we need. It unwraps the action by pattern and assumes parameter (index of GifViewer) in the Action composition chain. `GifViewer.3.NewGif` is unwrapped into action:

```javascript
{
  type: 'NewGif',
  matching: {
    args: {
      param: 3
    }
  }
}
```

You can override default Matcher implementation by passing third argument to `case` function:

```javascript
import { Updater, Matchers } from 'redux-elm';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('GifViewer', (model, action) => {
    // We assume that the action starts with `GifViewer` and is followed by `gifViewerIndex`
    //
    // We need to parse action `param` because the matching is string-based
    // and all arguments are passed in as strings
    const numericGifViewerIndex = parseInt(action.matching.args.param, 10);

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
  .case('GifViewer', (model, action) => {
    const numericGifViewerIndex = parseInt(action.matching.args.param, 10);

    return {
      ...model,
      gifViewers: model.gifViewers.map((gifViewerModel, index) => {
        if (index === numericGifViewerIndex) {
          return gifViewerUpdater(gifViewerModel, action);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
```

We want to map over all the GifViewer models and find the one with the appropriate index. If the index matches then we call the child Updater (`gifViewerUpdater`) providing the Model slice and unwrapped action (`NewGif` or `RequestMore`). If the index does not match, we just return the original reference.

### Finishing dynamic list of Components implementation

Good news: that was the hard part. Now comes the easy part. We just need to handle two more actions: `ChangeTopic` and `Create`, where `ChangeTopic` changes the `topic` property of the Model. So what should happen when the `Create` Action is dispatched? As its name suggests, the handler is responsible for creating a Model for a newly added `GifViewer`. So let's just append new model to list of `gifViewers`

```javascript
import { Updater, Matchers } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit } from '../gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel, saga)
  .case('ChangeTopic', (model, { value }) => ({ ...model, topic: value }))
  .case('Create', model => ({
    ...model,
    topic: '',
    gifViewers: [...model.gifViewers, gifViewerInit(model.topic)]
  }))
  .case('GifViewer', (model, action) => {
    const numericGifViewerIndex = parseInt(action.matching.args.param, 10);

    return {
      ...model,
      gifViewers: model.gifViewers.map((gifViewerModel, index) => {
        if (index === numericGifViewerIndex) {
          return gifViewerUpdater(gifViewerModel, action);
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