## Hello World!

In `main.js` there's just a single `run` function that starts the application.

```javascript
import run from './boilerplate';

import view from './hello-world/view';
import updater from './hello-world/updater';

run('app', view, updater);

```

`run` starts the application; you only need to provide the **Root Component**. Every Elmish component consists of two parts: **Updater** and **View**. We call it the Root Component because a typical Elmish architecture is modeled in form of a component tree, and every tree has a root. In the Hello World example we have just one component, so it's the Root Component by default.

`run` takes three arguments:
- the first argument is the `id` attribute of the HTML node we would like to mount the component on. In `redux-elm-skeleton`, it is app' because there is `<div id="app"></div>` inside our `index.html`.
- the second argument is `view`, which is just a plain old React component. It can be either a `class` which `extends` from `Component` or a stateless function.
- the third argument is `updater`, An Updater is very similiar to a [Redux Reducer](http://redux.js.org/docs/basics/Reducers.html) except it's not a plain old JavaScript function, it's a [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) function.

Let's have a look at `view.js` inside the `hello-world` repository:

```javascript
import React from 'react';
import { view } from 'redux-elm';

export default view(({ model, dispatch }) => {
  if (model.greeted) {
    return <div>Hello World!</div>;
  } else {
    return <button onClick={() => dispatch({ type: 'SayHi' })}>Say Hi</button>;
  }
});

```

Any View in `redux-elm` application must be wrapped with `view` function which is exposed by `redux-elm`, other than that, there's basically nothing special about the View, it's just a stateless function which conditionally returns either a greeting or a button. Every View receives at least two mandatory `props`:
1. `dispatch` - The regular [Redux dispatch function](http://redux.js.org/docs/api/Store.html#dispatch)used for dispatching an action
2. `model` - The Model to be used by the View. We render markup based on this Model. In other (mathematical) words, the View is function of the Model. **In the View the Model can only be queried, with any mutations happening in an Updater**.

Think of your View as a declarative definition of how the HTML markup should look based on the Model.

The Updater is a bit tricker:

```javascript
import { Updater } from 'redux-elm';

const initialModel = {
  greeted: false
};

export default new Updater(initialModel)
  .case('SayHi', model => ({ ...model, greeted: true }))
  .toReducer();
```

For now, think of your Updater as a series of functions which are applied to the Model whenever an action matches the provided pattern.

When implementing an Updater, there are two conditions it must meet:

1. Every Updater must be provided with an initial Model. The initial Model is the first argument of the `Updater` constructor and can be basically any type (except a function): `String`, `Object`, `Number`, etc.
2. Every Updater must be converted to a Reducer by calling the `toReducer()` method on the Updater instance.

An Updater in its simplest form could look like this:

```javascript
import { Updater } from 'redux-elm';

export default new Updater(0)
  .toReducer();
```

The Model consists of an `Integer` with an initial value of 0.

Now imagine the following View:

```javascript
import React from 'react';
import { view } from 'redux-elm';

export default view(({ model, dispatch }) => <div>{model}</div>);
```

After running the application you'll only see 0 on the screen because it's the initial value of the Model.

![hello-world-app-3](../assets/3.png)

However, this Updater pretty useless since it does not define any mutations on the model. In a real-world application, you want to allow the user to interact with the UI, resulting in some mutation of the Model. For instance: Whenever the user clicks a button, a boolean flag in the Model should be set. Because, as I've already mentioned, our View is a function of the Model, we can define how our page should look when the flag is truthy, such as displaying the greeting message.

To define the mutation we need to say when it should happen, and that's where the **`dispatch`** function passed to the View is used:

```javascript
<button onClick={() => dispatch({ type: 'SayHi' })}>Say Hi</button>;
```

When the user clicks the button we dispatch an Action with type `SayHi`. This object is just a declarative description of some Event. When an Action is dispatched, it should be handled in the appropriate Updater. This is exactly where the **`case`** method comes in handy:

```javascript
export default new Updater(initialModel)
  .case('SayHi', model => ({ ...model, greeted: true }))
  .toReducer();
```

We are defining the mutation of the Model in the Updater using `case` method. It has two required arguments:

1. A String pattern for matching the Action
2. An Updater function which is responsible for mutating the Model.

Let's take a closer look at the Updater function:

```javascript
model => ({ ...model, greeted: true })
```

As you can see, all it does is take the current Model as an argument and outputs a new Model with some changes. It's very important that you **always return a brand new Model object in the Updater function**. Otherwise `redux` wouldn't know the Model has changed and therefore wouldn't re-render your View. That's why we use the ES2015 [spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) to create a new copy of the model with only the field we want (`greeted`) changed.
