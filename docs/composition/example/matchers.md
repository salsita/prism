## Introducing Matchers

Every Updater must be provided with Matcher implementation. Matcher is responsible for matching action and passing it to corresponding Handler and it's the second argument when creating instance of `Updater`:

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

So far we've been always providing `exactMatcher`, you can write your own implementation of Matcher and we will cover this. `redux-elm` is shipped with three basic implementations:

1. `exactMatcher`
2. `matcher`
3. `parameterizedMatcher`

If you don't provide any Matcher to Updater, `matcher` is taken as default.

#### exactMatcher
This is simplest matcher which is looking for exact match in Action type. Provided action for the handler is exactly the same as dispatched action. This is basically `redux` `switch` in Reducer alternative. This is specifically not very useful for Action composition but is mandatory for "leaf" Actions, these are Actions which does not have any child Action. Therefore we used this Matcher for our examples so far because there was no Action Composition needed.

#### matcher
Default Matcher implementation, which you will probably need for most Actions. This Matcher unwraps action, what does it mean? Assuming that `Top` is provided as Matching pattern to `case` function and action starting with `Top.` is dispatched this Matcher will match the Action and strips off the `Top.` prefix passing the rest of action type to corresponding updater, see example:

```javascript
// Assuming { type: 'Top.NewGif', payload: 'some magic url' } has been dispatched:

export default new Updater(initialModel, Matchers.matcher)
  .case('Top', function*(model, action) {
    // Action is matched and therefore handler is called however `action` argument is not `Top.NewGif` but it's
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
Very similiar to `matcher` but it allows to parameterize the Action with single parameter, this is especially very useful for dynamic structures like some dynamic lists of Components, we will cover its usage later.

```javascript
// Assuming { type: 'GifViewers.42.NewGif', payload: 'some magic url' } has been dispatched:

export default new Updater(initialModel, Matchers.parameterizedMatcher)
  .case('GifViewers', function*(model, action, gifViewerId) {

    // gifViewerId plays a role of the parameter here
    //
    // Action is matched and therefore handler is called however `action` argument is not `GifViewers.42.NewGif` but it's
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
