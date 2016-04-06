import React from 'react';
import { forwardTo } from 'redux-elm';

import Counter from '../counter/view';

export default ({ model, dispatch }) => (
  <div>
    <Counter model={model.topCounter} dispatch={forwardTo(dispatch, 'TopCounter')} />
    <Counter model={model.bottomCounter} dispatch={forwardTo(dispatch, 'BottomCounter')} />
    <button onClick={() => dispatch({ type: 'Reset' })}>RESET</button>
  </div>
);
