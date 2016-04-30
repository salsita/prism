## Writing Custom Matcher

Let's have a look at the `exactMatcher` implementation:

```javascript
export default pattern => {
  return action => {
    if (action.type === pattern) {
      return [ action.type ];
    } else {
      return false;
    }
  };
};
```

As you can see, a Matcher is a function that takes `pattern` as an argument and returns a function that takes an Action as its argument. The function returns either `false` when the Action does not match or, when it does, an `Array` with at least one element (which must be the Action type). For `exactMatcher`, we return just the original `action.type` because the Action is not being unwrapped. Any additional elements in the array will be passed to the handler as further arguments.

Let's implement our own matcher Matcher:

```javascript
const endsWithMatcher = pattern => {
  return action => {
    if (action.type.endsWith(pattern)) {
      return [ pattern ];
    } else {
      return false;
    }
  };
};
```

What have we just implemented? `endsWithMatcher` matches an Action that ends with a specific pattern. By pure coincidence, this is exactly what we need in our application:

```javascript
import { Updater, Matchers, mapEffects } from 'redux-elm';

import counterUpdater from '../counter/updater';
import countersPairUpdater from '../counters-pair/updater';

function* init() {
  return {
    counter: yield* mapEffects(counterUpdater(), 'Counter'),
    countersPair: yield* mapEffects(countersPairUpdater(), 'CountersPair'),
    globalCounter: 0
  };
}

const endsWithMatcher = pattern => {
  return action => {
    if (action.type.endsWith(pattern)) {
      return [ pattern, 'Hello World', 'Hello World2' ];
    } else {
      return false;
    }
  };
};

export default new Updater(init)
  .case('Counter', function*(model, action) {
    return {
      ...model,
      counter: yield* mapEffects(counterUpdater(model.counter, action), 'Counter')
    };
  })
  .case('CountersPair', function*(model, action) {
    return {
      ...model,
      countersPair: yield* mapEffects(countersPairUpdater(model.countersPair, action), 'CountersPair')
    };
  })
  .case('Increment', function*(model, action, helloWorldArg, helloWorldArg2) {
    // Any action which ends with Increment is handled here
    //
    // action argument would be just { type: 'Increment' } because we've unwrapped it in the Matcher
    // helloWorldArg would just contain String 'Hello World' because we've provided it in the Matcher
    // helloWorldArg2 would just contain String 'Hello World2' because we've provided it in the Matcher

    return {
      ...model,
      globalCounter: model.globalCounter + 1 // Any Increment action increments global counter
    };
  }, endsWithMatcher)
  .toReducer();
```

After compiling and running the application, the global counter should be updated whenever you click on the individual counters.

For better understanding of Matchers, we strongly encourage you to have a look at the [built-in Matcher implementations](https://github.com/salsita/redux-elm/tree/master/src/matchers) shipped as part of `redux-elm`.