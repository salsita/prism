## Writing Custom Matcher

Matcher is a function that takes `pattern` as an argument and returns a function that takes an Action as its argument. The function returns either `false` when the Action does not match or, when it does, an `Object` consisting from three fields `unwrap`, `wrap`, and `args`.

* `unwrap` is unwrapped action type
* `wrap` is stripped part of the action which can be used for wrapping the action
* `args` is optional object which may hold any arguments passing to action

Let's implement our own matcher Matcher:

```javascript
const endsWithMatcher = pattern => {
  return action => {
    if (action.type.endsWith(`.${pattern}`)) {
      const wrapRegExp = new RegExp(`(.*)\.${pattern}$`); // In production application pattern should definitely be escaped!

      return {
        unwrap: pattern,
        wrap: action.type.match(wrapRegExp)[1],
        args: {}
      }
    } else {
      return false;
    }
  };
};
```

What have we just implemented? `endsWithMatcher` matches an Action that ends with a specific pattern. By pure coincidence, this is exactly what we need in our application:

```javascript
import { Updater } from 'redux-elm';

import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater';
import countersPairUpdater, { initialModel as countersPairInitialModel } from '../counters-pair/updater';

const endsWithMatcher = pattern => {
  return action => {
    if (action.type.endsWith(`.${pattern}`)) {
      const wrapRegExp = new RegExp(`(.*)\.${pattern}$`);

      return {
        unwrap: pattern,
        wrap: action.type.match(wrapRegExp)[1],
        args: {}
      }
    } else {
      return false;
    }
  };
};

const initialModel = {
  counter: counterInitialModel,
  countersPair: countersPairInitialModel,
  globalCounter: 0
};

export default new Updater(initialModel)
  .case('Counter', (model, ...rest) => ({ ...model, counter: counterUpdater(model.counter, ...rest) }))
  .case('CountersPair', (model, ...rest) => ({ ...model, countersPair: countersPairUpdater(model.countersPair, ...rest) }))
  .case('Increment', model => {
    // Any action which ends with Increment is handled here

    return {
      ...model,
      globalCounter: model.globalCounter + 1
    };
  }), endsWithMatcher)
  .toReducer();

```

After compiling and running the application, the global counter should be updated whenever you click on the individual counters.

For better understanding of Matchers, we strongly encourage you to have a look at the [built-in Matcher implementations](https://github.com/salsita/redux-elm/tree/master/src/matchers) shipped as part of `redux-elm`.