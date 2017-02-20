import { Action } from 'redux';
import { buildReducer, buildUnwrapper } from 'prism';

import counterReducer, { CounterState, initialState as counterInitialState } from './counterReducer';

export interface CountersPairState {
  top: CounterState,
  bottom: CounterState
};

const initialState : CountersPairState = {
  top: counterInitialState,
  bottom: counterInitialState
};

export default buildReducer([{
  unwrapper: buildUnwrapper('Top'),
  handler: (state, action) => ({
    ...state,
    top: counterReducer(state.top, action)
  })
}, {
  unwrapper: buildUnwrapper('Bottom'),
  handler: (state, action) => ({
    ...state,
    bottom: counterReducer(state.bottom, action)
  })
}, {
  unwrapper: buildUnwrapper('ResetCounters'),
  handler: (state, action) => initialState
}], initialState);
