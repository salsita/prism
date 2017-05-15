# [prism](http://salsita.github.io/prism)

> React / Redux action composition made simple

Given function `f` and function `g` we can simply compose them: `f ∘ g = f(g())`.

Function composition in JavaScript is just a matter of calling function and passing the result as input to other function. This thesis can be applied to [React Components](https://facebook.github.io/react/docs/react-component.html) and [Redux Reducers](http://redux.js.org/docs/basics/Reducers.html) as well, because functional stateless Component is nothing but function of its props (state of the application) and Reducer is just another plain JavaScript function. Can we compose [actions](http://redux.js.org/docs/basics/Actions.html)?

Yes we can! Let's just call it action wrapping. Because it's the same principle like you would be wrapping a box inside a box, the last box in the hierarchy contains some object and that's the Action. We can just wrap action type to keep things simple and because action type is just a string, it's as easy as function composition.

```javascript
const wrapWithFoo = actionType => `Foo.${actionType}`;
const wrapWithBar = actionType => `Bar.${actionType}`;

const composedActionType = wrapWithFoo(wrapWithBar('Baz'));

// Composed action type would be 'Foo.Bar.Baz';
```

## What is it good for?

Imagine you've just implemented your awesome Calendar widget, but then comes a new requirement and you need to have two of those widgets on page so that user can select a date range. With plain old Redux, you need to do two steps:

1. Isolate state in `calendarReducer` for particular instance of the Calendar
2. Tag all the outgoing actions in `Calendar` component by id of the Calendar

`prism` ensures that these points are a breeze. Both of the points in particular are nothing but function composition.

`prism` is useful when you need to instantiate or isolate a UI component, where the UI component is defined as pair of View (React component) and correpsonding State (Redux Reducer).

## Installation & Usage
You can install `prism` via npm.

```
npm install prism --save
```

The only peer dependency is React. Install `react` as well if you haven't done that yet.

## Examples

For now, there's just one example showing action composition in action:

1. [Counters Pair](./examples/counters)

## Inspiration

This project was previously called `redux-elm` and you should still be able to see how those ideas evoled over time in git history. So significiant amount of inspiration has been drawn from [The Elm Architecture](https://guide.elm-lang.org/architecture/)

