## Table of Contents

WIP

### Getting Started Tutorial

This tutorial will guide you through basics of `redux-elm` by implementing simple application and explaining concepts on top of that.

 TODO: describe the application

#### Necessary boilerplate
Before we get into coding let's start by cloning [https://github.com/salsita/redux-elm-skeleton](skeleton) project which will abstract away all the boilerplate needed for initializing modern ES2016/React/Webpack project. Throughout the code examples we'll probably not strictly use all the ES2016 features as it may be confusing for newcomers.

The directory structure of the skeleton project is fairly straightforward:

* `src` - Folder containing all your source files
  * `hello-world` - Our first `redux-elm` component, every component must expose two mandatory files: `updater` and `view`
    * `updater.js` - Elmish `updater` - we'll explain this later
    * `view.js` - React stateless Component
  * `boilerplate.js` - this file abstracts away all the boilerplate needed for using react/redux/redux-elm, it exports just single function, which we call `run`. You don't need to understand the code for now
  * `main.js` - your main file which uses function exposed from `boilerplate.js` and calls it with specific root component, which in our case is `hello-world`
* `index.html` - index file needed for displaying HTML
* `package.json` - dependencies description

You can try the [hello-world](https://github.com/salsita/redux-elm-skeleton/tree/master/src/hello-world) by simply running:

```javascript
npm install
npm start
```

`npm start` will start local HTTP server on port 3000 so you can't simply open your browser with http://localhost:3000 you should see following Hello World application:

![hello-world-app-1](./assets/1.png)

which after clicking the button shows Hello World message

![hello-world-app-1](./assets/2.png)
