import React from 'react';
import { patternMatch } from 'redux-elm';

// UPDATE

const Actions = {
  Increment: 'Increment',
  Decrement: 'Decrement'
};

export const update = patternMatch(0)
  .case(Actions.Increment, model => model + 1)
  .case(Actions.Decrement, model => model - 1);

const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
};

// VIEW

export const View = ({dispatch, model}) => (
  <div>
    <button onClick={() => dispatch({ type: Actions.Decrement })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch({ type: Actions.Increment })}>+</button>
  </div>
);
