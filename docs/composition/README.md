## Composition

If Redux is really missing something out of the box, it's some kind of Encapsulation and **Composition is a new Encapsulation in functional programming lingo**. Redux gives programmer a huge power by having single instance of application state in one place. However, with great power comes great responsibility and that's why sometimes it tends people to abuse that power, which can gradually lead to very coupled Components and hardly maintanable code base. `redux-elm` is strict, it defines hard boundaries between components and does not allow to break them. Decoupling is one of the benefits of `redux-elm`.

**Composition is an essential concept in the Elm Architecture** and it's what makes `redux-elm` different than plain old `react` with `redux`. Traditionally you can compose views in `react` by simply nesting them, this top-down approach means that parent component is aware of public interface of its direct children and children does not know anything about its parent, it only exposes public interface using callbacks in `props`:

```javascript
class ParentView extends Component {

  onTextFieldValueChanged(value) {
    this.setState({
      textFieldValue: value
    });
  }

  render() {
    return (
      <ChildView textFieldValue={this.state.textFieldValue} onTextFieldChanged={::this.onTextFieldValueChanged} />
    );
  }
}

const ChildView = ({ onTextFieldChanged, textFieldValue }) => ({
  <input type="text" onChange={onTextFieldChanged} value={textFieldValue} />
});
```

`ParentView` takes role of managing all the state and communicates with `ChildView` using `onTextFieldChanged` callback passed via `props`. This approach however has one significiant drawback, `ParentView` must be aware of internal details of `ChildView` because it must know that there's some `textFieldValue`. The Elm Architecture therefore presents concept of Model and Model is some Object which encapsulates state of the Component, so instead of passing all the values via `props` we'll pass just model which hides everything in its structure.

```javascript
const RootView = ({ model }) => ({
  <ParentView model={model.parentViewModel}
})

const ParentView = ({ model }) => ({
  <ChildView model={model.childViewModel} />
});

const ChildView = ({ model, onTextFieldChanged }) => ({
  <input type="text" onChange={onTextFieldChanged} value={model.value} />
});
```

Now parent only knows that it has Child and the Child has its own Model but Parent does not need to know anything about implementation details of Child. The Model Composition is pretty obvious:

```javascript
{
  parentViewModel: {
    childViewModel: {
      value: 'Text Field Value'
    }
  }
}
```

It's pretty common to compose Application State (Model) and Views in `react` with `redux`, so what's actually the main (and probably only) distinction between `redux` and The Elm Architecture?
