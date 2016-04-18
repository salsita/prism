import React from 'react';
import { forwardTo } from 'redux-elm';

import Counter from '../counter/view';

const viewCounter = (dispatch, model, index) => <Counter key={index} dispatch={forwardTo(dispatch, 'Counter', index)} model={model} />;

export default ({ model, dispatch }) => (
  <div>
    <button onClick={() => dispatch({ type: 'Remove' })}>Remove</button>
    <button onClick={() => dispatch({ type: 'Insert' })}>Add</button>
    {model.counters.map((counterModel, index) => viewCounter(dispatch, counterModel, index))}
  </div>
);
