import React from 'react';

const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
};

export default ({ model, dispatch }) => (
  <div>
    <button onClick={() => dispatch({ type: 'Decrement' })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch({ type: 'Increment' })}>+</button>
  </div>
);
