import React from 'react';

// UPDATE

const ACTION_INCREMENT = 'ACTION_INCREMENT';
const ACTION_DECREMENT = 'ACTION_DECREMENT';

export const update = function*(model = 0, { type }) {
  switch (type) {
  case ACTION_INCREMENT:
    return model + 1;

  case ACTION_DECREMENT:
    return model - 1;

  default:
    return model;
  }
};

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
    <button onClick={() => dispatch(ACTION_DECREMENT)}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch(ACTION_INCREMENT)}>+</button>
  </div>
);
