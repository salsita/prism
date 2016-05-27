## Composition

If Redux is missing something out of the box, it's some kind of Encapsulation. And **Composition is the new Encapsulation in functional programming lingo**. Redux gives programmers huge power by maintaining the entire application state in one place. However, not everyone accepts the great responsibility that comes with this great power, which can gradually lead to tightly coupled Components and a hard-to-maintain code base. `redux-elm` defines strict boundaries between components and does not allow us to break them. Decoupling is one of the principal benefits of `redux-elm`.

**Composition is an essential concept of the Elm Architecture**, and it's what makes `redux-elm` different from plain old Redux. Traditionally you can compose views in React simply by nesting them. This top-down approach means that the parent Component is aware of the public interface of its direct children, whereas children do not know anything about their parent besides the public interface defined using callbacks in `props`:

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

`ParentView` takes the role of managing all the state and communicates with `ChildView` using the `onTextFieldChanged` callback passed via `props`. This approach has one significiant drawback, however: `ParentView` must be aware of the internal details of `ChildView`, because it must know that it has a property called `textFieldValue`. The Elm Architecture therefore has the concept of a Model, where Model is an object that encapsulates the state of the Component. So instead of passing all the values via `props` (and thereby breaking encapsulation), we pass just the Model (which hides everything in its structure).

```javascript
const RootView = ({ model }) => (
  <ParentView model={model.parentViewModel}
)

const ParentView = ({ model, dispatch }) => (
  <ChildView model={model.childViewModel} onTextFieldChanged={() => dispatch({ type: 'ParentSpecificAction' })} />
);

const ChildView = ({ model, onTextFieldChanged }) => (
  <input type="text" onChange={onTextFieldChanged} value={model.value} />
);
```

Now the parent only knows that it has a child and that the child has its own Model. The Parent does not need to know anything about the implementation details of the child. The Model Composition is straightforward:

```javascript
{
  parentViewModel: {
    childViewModel: {
      value: 'Text Field Value'
    }
  }
}
```

It is common to compose Application State (Model) and Views in Redux, so what is actually the main (and probably only) difference between Redux and The Elm Architecture?
