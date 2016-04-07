## Writing Custom Matcher

Implementation of Custom Matcher is fairly straighforward, let's have a look at `exactMatcher` implementation:

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

As you can see Matcher is a Function which takes `pattern` as argument and returns a Function which matches Action (action is provided as argument). Matching actions means that the function returns either `false` when action does not match or `Array` is returned with at least one element which must be action type. For `exactMatcher` we return just original `action.type` because action is not being unwrapped. All the remaining elements of the array will be passed to `Updater` handler as additional arguments.

Let's implement some Matcher:

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

So what we've just implemented? `endsWithMatcher` matches action which ends with specified pattern and we could seize the fact for implementing our Application:

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

After compiling and running the application global counter should get updated as you click on the individual counters.

For better `Matchers` understanding we strongly encourage you to have a look at [shipped-in implementations](https://github.com/salsita/redux-elm/tree/master/src/matchers) of all the Matchers.