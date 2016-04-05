## Action Composition

The part which makes the Elm Architecture unique is Action Composition, the idea is pretty simple. Just imagine how it works in Redux, in really deeply nested View you can `dipsatch` an action and the action can be handled basically by any Reducer, that's **key principle of Redux: any Reducer can handle any Action** because action hierarchy is flat, there's no Action composition.

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

What we mean by Action nesting is simply having sub-action as `payload` of parent action. However, you might protest that working with nested actions may be a bit clumsy therefore `redux-elm` simplifies that by defining Action composition in Action `type` by simply using `.` delimited nested types, therefore above example actually looks like this:

```javascript
{
  type: 'PARENT_COMPONENT.CHILD_COMPONENT_ACTION_TYPE',
  payload: 'payload'
}
```

From `redux` perspective there's no difference between traditional plain old `redux` Action and nested `redux-elm` Action except there's some convention in Action type.
