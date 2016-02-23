import React from 'react';

import { View as Counter, update as counterUpdate } from '../1-counter/main';
import { patternMatch, forwardTo } from 'redux-elm';

// UPDATE

const Actions = {
  Reset: 'Reset',
  TopCounter: 'TopCounter',
  BottomCounter: 'BottomCounter'
};

export const update = patternMatch({
  topCounter: counterUpdate(),
  bottomCounter: counterUpdate()
})
  .case(Actions.Reset, () => ({ topCounter: counterUpdate(), bottomCounter: counterUpdate() }))
  .case(Actions.TopCounter, (model, action) => ({ ...model, topCounter: counterUpdate(model.topCounter, action) }))
  .case(Actions.BottomCounter, (model, action) => ({ ...model, bottomCounter: counterUpdate(model.bottomCounter, action) }));

// VIEW

export const View = ({dispatch, model}) => (
  <div>
    <Counter model={model.topCounter} dispatch={forwardTo(dispatch, Actions.TopCounter)} />
    <Counter model={model.bottomCounter} dispatch={forwardTo(dispatch, Actions.BottomCounter)} />
    <button onClick={() => dispatch({ type: Actions.Reset })}>RESET</button>
  </div>
);
