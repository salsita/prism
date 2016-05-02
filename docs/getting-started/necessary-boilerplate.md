## Overview of Boilerplate

Before we get to coding, let's start by cloning the [skeleton](https://github.com/salsita/redux-elm-skeleton) project which will abstract away all the boilerplate needed for a modern ES2016/React/Webpack project. In the code examples we'll stay away from more advanced [ES2016](http://www.2ality.com/2016/01/ecmascript-2016.html) features to avoid confusing newcomers.

The directory structure of the skeleton project is straightforward:

* `src` - Folder containing all the source files
  * `hello-world` - Our first `redux-elm` component, every component must expose two mandatory files: `updater` and `view`
    * `updater.js` - Elmish `Updater` - we'll explain this later
    * `view.js` - [React stateless Component](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)
  * `boilerplate.js` - Abstracts away all the boilerplate needed for using React/Redux/Redux-Elm and exports a single function called `run` (you don't need to understand the code for now)
  * `main.js` - Main file that calls the `run` function exposed by `boilerplate.js` with the appropriate root component (in our case `hello-world`)
* `test` - Folder containing all test-related code
  * `hello-world` - Unit tests for the `hello-world` Component
* `index.html` - Index file containing top-level HTML
* `package.json` - Node.js manifest used by Webpack

You can try the [hello-world example](https://github.com/salsita/redux-elm-skeleton/tree/master/src/hello-world) by simply running:

```javascript
npm install
npm start
```

`npm start` will start a local HTTP server on port 3000. Point your browser to http://localhost:3000 and you should see the following Hello World application:

![hello-world-app-1](../assets/1.png)

Clicking the button shows the Hello World message:

![hello-world-app-2](../assets/2.png)
