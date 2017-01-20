import { reducer, unwrapper, parameterizedUnwrapper } from 'redux-elm';

import gifViewerReducer, { initialState as gifViewerInitialState } from './gifViewerReducer';

const initialState = {
  topic: '',
  gifViewers: []
};

export default reducer(
  [unwrapper('ChangeTopic'), (state, { payload }) => ({
    ...state,
    topic: payload
  })],
  [unwrapper('Create'), state => ({
    ...state,
    topic: '',
    gifViewers: [...state.gifViewers, gifViewerInitialState(state.topic)]
  })],
  [parameterizedUnwrapper('GifViewer'), (state, action) => ({
    ...state,
    gifViewers: state.gifViewers.map((gifViewerState, index) => {
      if (index === parseInt(action.args.param, 10)) {
        return gifViewerReducer(gifViewerState, action);
      } else {
        return gifViewerState;
      }
    })
  })],
  initialState
);
