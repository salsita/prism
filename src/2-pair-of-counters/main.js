import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';

import createElmishStore from '../elm/createElmishStore';
import forwardTo from '../elm/forwardTo';
import { View as Counter, update as counterUpdate } from '../1-counter/main';

// UPDATE

const RESET = 'RESET';
const TOP = 'TOP';
const BOTTOM = 'BOTTOM';

export const update = (model = {}, action) => {
  const { type, payload } = action;

  switch (type) {
  case TOP:
    return {
      ...model,
      topCounter: counterUpdate(model.topCounter, payload)
    };

  case BOTTOM:
    return {
      ...model,
      bottomCounter: counterUpdate(model.bottomCounter, payload)
    };

  case RESET:
  default:
    // No need for {topCounter: 0, bottomCounter: 0}
    // we better let the state shape encapsulated in the Counter component
    return {
      topCounter: counterUpdate(undefined, action),
      bottomCounter: counterUpdate(undefined, action)
    };
  }
};

// VIEW

export const View = ({dispatch, topCounter, bottomCounter}) => (
  <div>
    <Counter model={topCounter} dispatch={forwardTo(dispatch, TOP)} />
    <Counter model={bottomCounter} dispatch={forwardTo(dispatch, BOTTOM)} />
    <button onClick={() => dispatch(RESET)}>RESET</button>
  </div>
);

// MAIN

const ConnectedView = connect(model => model)(View);
const store = createElmishStore(update);
const Application = () => <Provider store={store}><ConnectedView /></Provider>;

render(<Application />, document.getElementById('app'));
