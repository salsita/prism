## GifViewer tutorial

Because we've covered basics of `redux-elm` we may want try to build something. Let's build an application which shows Random GIF fetched from http://giphy.com/ we'll fetch GIFs only for specific topic which will be a parameter of the Component. We'll also allow user to interact by showing a "More Please!" button which fetches next GIF.

![gif-viewer-1](../assets/4.png)

Let's start by creating a folder called `gif-viewer` in `src` folder of `redux-elm-skeleton`. The folder should contain two files `updater.js` and `view.js`. Because we want to use the Component as Root of our `redux-elm-skeleton` repo, we need to change `main.js` accordingly.

Now change `main.js` to use the newly created Component:

```javascript
import run from './boilerplate';

// Import appropriate Component
import view from './gif-viewer/view';
import updater from './gif-viewer/updater';

run('app', view, updater);
```