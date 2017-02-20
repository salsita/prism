# `buildReducer(handlers, initialState)`

Creates a Redux compatible [Reducer](http://redux.js.org/docs/basics/Reducers.html). 

#### Arguments

1. `handlers` *(Array<UnwrapperHandlerPair>)*: An array of `UnwrapperHandlerPair` which is just an object consisting of two fields: `unwrapper` and `handler`

2. [`initialState`] *(any)*: Initial state to be used as a default value for the reducer.

#### Returns

`reducer` *(Function)*: Plain old JavaScript function which can be used as Redux reducer.

#### Example

```js
import { buildReducer, buildUnwrapper } from 'prism';

const reducer = buildReducer([{
  unwrapper: buildUnwrapper('Increment'),
  handler: state => state + 1
}, {
  unwrapper: buildUnwrapper('Decrement'),
  handler: state => state - 1
}], 0);

let state = undefined;
state = reducer(state, { type: 'Increment' });
state = reducer(state, { type: 'Increment' });
state = reducer(state, { type: 'Increment' });
state = reducer(state, { type: 'Decrement' });

console.log(state); // 2
```
