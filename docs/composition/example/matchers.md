## Introducing Matchers

Every Updater must be provided with a Matcher implementation. The Matcher is responsible for matching an Action and passing it to the corresponding Handler. It is the second argument when creating an `Updater` instance:

```javascript
import { Updater, Matchers } from 'redux-elm';

const initialModel = {};

export default new Updater(initialModel, Matchers.exactMatcher)
  .case('ExactMatch', function*(model, action) {
    // where action is:
    // {
    //   type: 'ExactMatch',
    //   payload: 'anything'
    // }

    return model;
  })
  .toReducer();
```

So far we've been always providing `exactMatcher`. `redux-elm` ships with three basic implementations:

1. `matcher` (the default)
2. `exactMatcher`
3. `parameterizedMatcher`

You can even write your own Matcher implementation as explained later.

#### exactMatcher
This is the simplest Matcher that looks for an exact match with the Action type. The Action provided to the handler is exactly the same as the dispatched Action. This is basically like using `switch` on the Action type in a Redux Reducer. This is not very useful for Action composition but is mandatory for "leaf" Actions; i.e. Actions that do not have any children. We've been using this Matcher in our examples so far because there was no Action Composition needed.

#### matcher
This is the default Matcher implementation that should be used for most Actions. It *unwraps* the Action. What does that mean? Suppose that `Top` is provided as the pattern to the `case` function and the Action starts with `Top.`. This Matcher will match the Action and strips off the `Top.` prefix, passing the rest of the Action type to corresponding Updater. For example:

```javascript
// Assuming { type: 'Top.NewGif', payload: 'some magic url' } has been dispatched:

export default new Updater(initialModel, Matchers.matcher)
  .case('Top', function*(model, action) {
    // Action is matched and handler is called, however `action` is not `Top.NewGif` but rather:
    //
    // {
    //   type: 'NewGif',
    //   url: 'some magic url'
    // }
    //

    return model;
  })
  .toReducer();
```

Cool, isn't it?

#### parameterizedMatcher
Very similiar to `matcher`, but it allows the Action to be parameterized with a single parameter. This is very useful for dynamic structures like lists of Components. We will cover its usage in more detail later.

```javascript
// Assuming { type: 'GifViewers.42.NewGif', payload: 'some magic url' } has been dispatched:

export default new Updater(initialModel, Matchers.parameterizedMatcher)
  .case('GifViewers', function*(model, action, gifViewerId) {

    // gifViewerId plays a role of the parameter here
    //
    // Action is matched and handler is called, however `action` is not `GifViewers.42.NewGif` but rather:
    //
    // {
    //   type: 'NewGif',
    //   url: 'some magic url'
    // }
    //

    return model;
  })
  .toReducer();
```
