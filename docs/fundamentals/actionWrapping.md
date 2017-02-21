## Action Wrapping

`Prism` utilizes a concept called action wrapping in order to achieve isolation of Components. So how does it work?

Imagine action of type `Increment`. If you want to constrain the action to particular Component instance you can simply prefix action type with string identifying the instance, for example: `TopCounter.Increment`. This mechanism is called action wrapping, because you technically wrap action inside another. Which is pretty much the same like:

```js
{
  type: 'TopCounter',
  payload: {
    type: 'Increment'
  }
}
```

Payload of action is another (nested) action.

`Prism` provides a function called [`enhanceComponent`](./api/enhanceComponent.md) which can be used to wrap [Redux Container Component](http://redux.js.org/docs/basics/UsageWithReact.html#implementing-container-components). This Component will be enhanced so that two more props are mandatory for the Component.

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