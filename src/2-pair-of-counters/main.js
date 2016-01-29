import React from 'react';

import forwardTo from '../elm/forwardTo';
import { View as Counter, update as counterUpdate } from '../1-counter/main';

// UPDATE

const RESET = 'RESET';
const TOP = 'TOP';
const BOTTOM = 'BOTTOM';

export const update = function*(model = {}, action) {
  const { type, payload } = action;

  switch (type) {
  case TOP:
    return {
      ...model,
      topCounter: yield* counterUpdate(model.topCounter, payload)
    };

  case BOTTOM:
    return {
      ...model,
      bottomCounter: yield* counterUpdate(model.bottomCounter, payload)
    };

  case RESET:
  default:
    // No need for {topCounter: 0, bottomCounter: 0}
    // we better let the state shape encapsulated in the Counter component
    return {
      topCounter: yield* counterUpdate(undefined, action),
      bottomCounter: yield* counterUpdate(undefined, action)
    };
  }
};

// VIEW

export const View = ({dispatch, model}) => (
  <div>
    <Counter model={model.topCounter} dispatch={forwardTo(dispatch, TOP)} />
    <Counter model={model.bottomCounter} dispatch={forwardTo(dispatch, BOTTOM)} />
    <button onClick={() => dispatch(RESET)}>RESET</button>
  </div>
);
