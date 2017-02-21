## Action Unwrapping

OK, there is the other side of the coin which is called Action Unwrapping. All the actions are already wrapped and using selectors we assume that our state is isolated, but now we need to be able to unwrap the action in reducer and mutate corresponding state slice. There's another helper function called [`buildReducer`](./api/buildReducer.md) for building a reducer which can handle wrapped actions.

`buildReducer` function accepts a list of `UnwrapperHandlerPair` the pair is actually an object containing two keys: `unwrapper` and `handler`.

`unwrapper` is just a function which takes an action as parameter and returns either unwrapped action or `null` when no action is matched. `handler` is quite self-explanatory.

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
