## Custom Matchers

You are already familiar with the built-in Matcher that `redux-elm` provides, which is `parameterizedMatcher`

In most cases these will be all you need, but sometimes you might have a very specific use case that would be difficult to implement with them. Imagine you have a `Counter` Component that counts how many times a button was clicked and displays it on the screen:

![custom-matchers-1](../assets/14.png)

The implementation is fairly straightforward:

### `Counter` Updater

```javascript
import { Updater } from 'redux-elm';

export const initialModel = 0;

export default new Updater(initialModel)
  .case('Increment', model => model + 1)
  .toReducer();
```

### `Counter` View

```javascript
import React from 'react';
import { view } from 'redux-elm';

export default view(({ model, dispatch }) => (
  <button onClick={() => dispatch({ type: 'Increment' })}>Clicked {model} times</button>
));
```

Now let's imagine we want to implement a Pair of `Counters`. We'll use what we know about [Composition](../composition/README.md) and build a `CountersPair`:

### `CountersPair` Updater

```javascript
import { Updater } from 'redux-elm';

import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater';

export const initialModel = {
  top: counterInitialModel,
  bottom: counterInitialModel
};

export default new Updater(initialModel)
  .case('Top', (model, action) => ({ ...model, top: counterUpdater(model.top, action) }))
  .case('Bottom', (model, action) => ({ ...model, bottom: counterUpdater(model.bottom, action) }))
  .toReducer();
```

### `CountersPair` View

```javascript
import React from 'react';
import { view, forwardTo } from 'redux-elm';

import Counter from '../counter/view';

export default view(({ model, dispatch }) => (
  <div>
    Top: <Counter model={model.top} dispatch={forwardTo(dispatch, 'Top')} />
    <br />
    Bottom: <Counter model={model.bottom} dispatch={forwardTo(dispatch, 'Bottom')} />
  </div>
));
```

![custom-matchers-2](../assets/15.png)

### Real-World Use Case

So now we have `Counter` and `CountersPair` implemented as independent Components. How might they be used in a real-world application? Let's imagine that the app will display `Counter` and `CountersPair` and then sum the clicks made on any of the buttons using a global counter.

![custom-matchers-3](../assets/16.png)

#### The Updater

```javascript
import { Updater } from 'redux-elm';

import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater';
import countersPairUpdater, { initialModel as countersPairInitialModel } from '../counters-pair/updater';

const initialModel = {
  counter: counterInitialModel,
  countersPair: countersPairInitialModel,
  globalCounter: 0
};

export default new Updater(initialModel)
  .case('Counter', (model, action) => ({ ...model, counter: counterUpdater(model.counter, action) }))
  .case('CountersPair', (model, action) => ({ ...model, countersPair: countersPairUpdater(model.countersPair, action) }))
  .toReducer();
```

#### The View (with Apologies to Whoopi Goldberg)

```javascript
import React from 'react';
import { view, forwardTo } from 'redux-elm';

import Counter from '../counter/view';
import CountersPair from '../counters-pair/view';

export default view(({ model, dispatch }) => (
  <div>
    <Counter model={model.counter} dispatch={forwardTo(dispatch, 'Counter')} />
    <CountersPair model={model.countersPair} dispatch={forwardTo(dispatch, 'CountersPair')} />
    <br />
    Global Counter: {model.globalCounter}
  </div>
));
```

Clicking on any `Counter` increments its value, but the global counter remains unchanged. That's because we didn't define the `globalCounter` mutation. Now is the right time to introduce a Custom Matcher implementation because we would like our Root Component to handle all `Increment` Actions regardless of how they are nested, as long as the type ends with an `Increment` segment.
