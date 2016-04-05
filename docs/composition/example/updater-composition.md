## Updater Composition

The reason why nothing really works now is that we haven't plumbed `GifViewer` Updater in yet. And we also need to initialize Child models properly therefore we need to turn initial Model into function:

```javascript
import { Updater } from 'redux-elm';

import { init as gifViewerInit } from '../gif-viewer/updater';

const funnyCatsGifViewerInit = gifViewerInit('funny cats');
const funnyDogsGifViewerInit = gifViewerInit('funny dogs');

export function* init() {
  return {
    top: yield* funnyCatsGifViewerInit(),
    bottom: yield* funnyDogsGifViewerInit()
  };
}

export default new Updater(init).toReducer();

```

First things first, we know that `init` function exposed by `GifViewer` is thunk (function which returns a function) therefore we need to call it "twice" to actually call it, first call takes one argument which is a topic for the `GifViewer` and returns initialize function which can be later used for initializing the Model, we'll use Cats for top `GifViewer` and Dogs for bottom. So hypothetically the app should now correctly show Topic above the `GifViewer` and also trigger initial API call.

Also you might have spotted `yield*` keyword, this is essential because Generators does not automatically propagate upper the call hierarchy and you need to explicitly say that you want to propagate `yield`s. Therefore anytime you call a generator function in your Updater, don't forget to prepend `yield*` keyword.

**Keep in mind, use `yield*` whenever you want to call Sub Updater and use `yield` whenever you want to `yield` a side effect**

![gif-viewer-pair-2](../../assets/8.png)

It's apparent from the screenshot that we can now see `GifViewer` topics and two API calls have been called.

### Redux DevTools extension
Are you wondering what's the nice browser extension on the right side in the screenshot above? It's [`redux-devtools-extension`](https://github.com/zalmoxisus/redux-devtools-extension) which allows you very nicely debug your Redux applications, it comes really handy and you should check it out. `redux-elm-skeleton` already integrates it, so you just need to install the [extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) in your browser and restart it, you should see Redux tab in your Chrome Dev Tools.
