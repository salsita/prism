# prism fundamentals

The main goal of this toolset is to easily allow user to isolate `react-redux` components. Imagine you have a counter with following `reducer` and React `Component`:

```js
import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <button onClick={onDecrement}>-</button>
    <span>{value}</span>
    <button onClick={onIncrement}>+</button>
  </div>
);

const counterReducer = (state = 0, { type }) => {
  switch (type) {
    case 'Increment':
      return state + 1;
    
    case 'Decrement':
      return state - 1;

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer
});

const ConnectedCounter = connect(
  state => ({
    value: state.counter
  })
)(Counter);

const store = createStore(rootReducer);

const RootComponent = () => (
  <Provider store={store}>
    <ConnectedCounter />
  </Provider>
);
```

But what if we want **two Counters**?

```js
const RootComponent = () => (
  <Provider store={store}>
    <div>
      <ConnectedCounter />
      <ConnectedCounter />
    </div>
  </Provider>
);
```

Ooops, this simply won't work. That's where `prism` comes to play for the rescue.

## Action Wrapping

`Prism` utilizes a concept called action wrapping in order to achieve isolation of components. So how does it work?

Imagine action of type `Increment` if you want to constrain the action to particular Component instance you can simply prefix action type with string identifying the instance, for example: `TopCounter.Increment`. This mechanism is called action wrapping, because you technically wrap action inside another. Which is pretty much the same like:

```js
{
  type: 'TopCounter',
  payload: {
    type: 'Increment'
  }
}
```

Payload of action is another (nested) action.

`Prism` provides a function called [`enhanceComponent`](./api/enhanceComponent.md) which can be used to wrap [Redux Container Component](http://redux.js.org/docs/basics/UsageWithReact.html#implementing-container-components). This Component will be enhanced so that two more possible props are mandatory for the Component.

1. `selector` - a function which selects a part of application state
2. `wrapper` - a function which defines how all the dispatched actions within the component should be wrapped

For isolated Components action wrapping would not be enough, we also need isolated application state slice and that's the reason for the second required prop which is `selector`.

```js
// Let's just define isolated Counter Presentional Component
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <button onClick={onDecrement}>-</button>
    <span>{value}</span>
    <button onClick={onIncrement}>+</button>
  </div>
);

// Then it's just a matter of connecting the Component with Redux store
// which effectively means creating Container Component
const ConnectedCounter = connect(
  state => ({
    value: state.value
  })
)(Counter);

// Wrapping the Component allow user to isolate it easily
const InstantiableConnectedCounter = enhanceComponent(ConnectedCounter);

// Now let's just instantiate two Counters
const RootComponent = () => (
  <div>
    <InstantiableConnectedCounter
      selector={state => state.topCounter} // State passed to mapStateToProps will be automatically selected using provided selector
      wrapper={type => `TopCounter.${type}`} // All the dispatched actions will be prefixed with TopCounter.
    />
    <InstantiableConnectedCounter
      selector={state => state.bottomCounter}
      wrapper={type => `BottomCounter.${type}`}
    />
  </div>
);
```

Obviously the code snippet above is responsible for rendering two independent instances of `Counter`, utilizng Action wrapping and selectors.

## Action Unwrapping

OK, there is the other side of the coin which is called Action Unwrapping. All the actions are already wrapped and using selectors we assume that our state is isolated, but now we need to be able to unwrap the action in reducer and mutate corresponding state slice. There's another helper function called [`buildReducer`](./api/buildReducer.md) for building a reducer which can handle wrapped actions.

`buildReducer` function accepts a list of `UnwrapperHandlerPair` the pair is actually an object containing two keys: `unwrapper` and `handler`.

`unwrapper` is just a function which takes an action as parameter and returns either unwrapped action or `null` when no action is matched.

```js
import { buildReducer } from 'prism';

// Obviously, this unwrapper is more of Matcher rather than
// unwrapper because it does not unwrap the action
// it only matches it
const buildMatchingUnwrapper = type => action => {
  if (action.type === type) {
    return action;
  } else {
    return null;
  }
};

const reducer = buildReducer([{
  unwrapper: buildMatchingUnwrapper('Increment'),
  handler: (state, action) => state + 1
}, {
  unwrapper: buildMatchingUnwrapper('Decrement'),
  handler: (state, action) => state - 1
}], 0); // Second argument is initial state
```

So far, our example was just showing how to match action, but what if we need to unwrap it as well? Well it's just a matter of returning modified unwrapped action:

```js
import { buildReducer } from 'prism';

const buildStartsWithUnwrapper = prefix => action => {
  if (action.type.startsWith(prefix)) {
    return {
      ...action,
      type: action.type.replace(`${prefix}.`, '')
    };
  } else {
    return null;
  }
};

const reducer = buildReducer([{
  unwrapper: buildStartsWithUnwrapper('TopCounter'),
  handler: (state, action) => ({
    ...state,
    topCounter: counterReducer(state.topCounter, action) // Action here is already unwrapped, due to unwrapper
  })
}, {
  unwrapper: buildStartsWithUnwrapper('BottomCounter'),
  handler: (state, action) => ({
    ...state,
    bottomCounter: counterReducer(state.bottomCounter, action) // Spot the difference in provided state slice
  })
}], {topCoutner: 0, bottomCounter: 0});
```

In most cases you need a combination of `startsWithUnwrapper` and `matchingUnwrapper`, the unwrapper either directly matches the action or just simply unwraps. `Prism` ships with built in `unwrapper` which is doing exactly that. Usage is trivial, just import [`buildUpdater`](./api/buildUpdater.md):

```js
import { buildUnwrapper, buildReducer } from 'prism';

export default buildReducer([{
  unwrapper: buildUnwrapper('Top'), // Unwraps Top prefixed actions
  handler: (state, action) => ({
    ...state,
    top: counterReducer(state.top, action)
  })
}, {
  unwrapper: buildUnwrapper('Bottom'), // Unwraps Bottom prefixed actions
  handler: (state, action) => ({
    ...state,
    bottom: counterReducer(state.bottom, action)
  })
}, {
  unwrapper: buildUnwrapper('ResetCounters'), // Direct match for ResetCounters action
  handler: (state, action) => initialState
}], initialState);

```
