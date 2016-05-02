## Action Composition

The part that makes the Elm Architecture unique is Action Composition. The idea is pretty simple. Remember that in Redux, a really deeply nested View you can dispatch an Action, and the Action can be handled by any Reducer. This is a key principle of Redux: **any Reducer can handle any Action** because the action hierarchy is flat and there is no Action composition.

```javascript
// Traditional Redux Action
{
 type: 'FLAT_ACTION_TYPE',
 payload: 'payload'
}
```

**The Elm Architecture allows Action nesting** and therefore Action Composition:

```javascript
{
  type: 'PARENT_COMPONENT',
  payload: {
    type: 'CHILD_COMPONENT_ACTION_TYPE',
    payload: 'payload'
  }
}
```

What we mean by Action nesting is that a sub-action can be used as the `payload` of a parent action. You might be concerned that working with nested actions could be a bit clumsy. `redux-elm` simplifies this by defining Action composition in the Action `type` string using `.` to delimited nested types. The above example therefore looks like this:

```javascript
{
  type: 'PARENT_COMPONENT.CHILD_COMPONENT_ACTION_TYPE',
  payload: 'payload'
}
```

From the Redux perspective there is no difference between a plain old Redux Action and a nested `redux-elm` Action; both just use a string to represent the type. `redux-elm` understands the mini-syntax used to delimit the nested types, so it can extract additional semantics from the type string.
