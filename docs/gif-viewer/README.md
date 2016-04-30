## GifViewer tutorial

Now that we've covered the basics of `redux-elm`, let's tackle a slightly more complex project. We'll build an application that shows random GIFs fetched from http://giphy.com/. We'll fetch images only for a particular topic that is specified as a parameter of the Component. We'll allow users to interact by pressing a "More Please!" button which fetches another image.

![gif-viewer-1](../assets/4.png)

Let's start by creating a folder called `gif-viewer` in the `src` folder of `redux-elm-skeleton`. The folder should contain two files: `updater.js` and `view.js`. Because we want to use the Component as the root of our `redux-elm-skeleton` repo, we need to change `main.js` accordingly:

```javascript
import run from './boilerplate';

// Import appropriate Component
import view from './gif-viewer/view';
import updater from './gif-viewer/updater';

run('app', view, updater);
```