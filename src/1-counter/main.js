import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';

import createElmishStore from '../elm/createElmishStore';

const ACTION_INCREMENT = 'ACTION_INCREMENT';
const ACTION_DECREMENT = 'ACTION_DECREMENT';

const update = (model = 0, { type }) => {
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

const View = connect(model => ({model}))(({dispatch, model}) => (
  <div>
    <button onClick={() => dispatch(ACTION_DECREMENT)}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch(ACTION_INCREMENT)}>+</button>
  </div>
));

const store = createElmishStore(update);
const Application = () => <Provider store={store}><View /></Provider>;

render(<Application />, document.getElementById('app'));
