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

