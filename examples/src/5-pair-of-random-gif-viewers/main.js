import React from 'react';

import { patternMatch, forwardTo, composeSaga } from 'redux-elm';
import { View as RandomGif, update as randomGifUpdate, saga as randomGifSaga } from '../4-random-gif-viewer/main';

// UPDATE

const Actions = {
  Left: 'Left',
  Right: 'Right'
};

export const update = patternMatch({
  left: randomGifUpdate(),
  right: randomGifUpdate()
})
  .case(Actions.Left, (model, action) => ({ ...model, left: randomGifUpdate(model.left, action) }))
  .case(Actions.Right, (model, action) => ({ ...model, right: randomGifUpdate(model.right, action) }));

export const saga = composeSaga(randomGifSaga, '[GifViewerType]');

// VIEW

export const View = ({dispatch, model}) => (
  <div style={{display: 'flex'}}>
    <RandomGif dispatch={forwardTo(dispatch, Actions.Left)} model={model.left} />
    <RandomGif dispatch={forwardTo(dispatch, Actions.Right)} model={model.right} />
  </div>
);
