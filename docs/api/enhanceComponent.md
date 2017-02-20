# `enhanceComponent(Component)`

Enhances Component so that it's possible to automatically wrap all the dispatched actions inside the component and state is automatically selected so that `connected` state is locally scoped.

#### Arguments

1. `React Component` *(ComponentClass)*: Connected React Component.

#### Returns

`ReactComponent` *(ComponentClass)*: Enhanced Component, which is capable of action wrapping & state unwrapping using selector.

#### Example

```js
import React from 'react';
import { connect } from 'react-redux';
import { enhanceComponent } from 'prism';

// First we create plain old React dumb component
const HelloWorldComponent = ({ name }) => <h1>Hello {name}</h1>;

// Now let's make it smart by connecting it with the application state
const ConnectedHelloWorldComponent = connect(
  state => ({
    name: state.bar.name
  })
)(HelloWorldComponent);

// Wrap it to Prism enhanced component so that we can instantiate the component by providing
// selector and wrapper in props
const PrismEnhancedConnectedHelloWorldComponent = enhanceComponent(ConnectedHelloWorldComponent);

// Usage:
// Let's suppose the app state has following shape:
// {
//  john: {
//    bar: {
//      name: 'John Doe'
//    }
//  },
//  alice; {
//    bar: {
//      name: 'Alice Doe'
//    }
//  }
// }

const RootComponent = () => (
  <div>
    <PrismEnhancedConnectedHelloWorldComponent
      selector={state => state.john}
      wrapper={type => `John.${type}`}
    />
    <PrismEnhancedConnectedHelloWorldComponent
      selector={state => state.alice}
      wrapper={type => `Alice.${type}`}
    />
  </div>
)
```