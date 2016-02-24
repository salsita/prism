import React, { PropTypes } from 'react';
import { Observable } from 'rxjs';

import { patternMatch, forwardTo } from 'redux-elm';
import { View as RandomGif, update as randomGifUpdate, saga as randomGifSaga, Actions as RandomGifActions } from '../4-random-gif-viewer/main';
import composeSaga from '../composeSaga';

// UPDATE

export const Actions = {
  Left: 'Left',
  Right: 'Right',
  InitPair: 'InitPair'
};

export const update = patternMatch({
  left: randomGifUpdate(),
  right: randomGifUpdate()
})
  .case(Actions.Left, (model, action) => ({ ...model, left: randomGifUpdate(model.left, action) }))
  .case(Actions.Right, (model, action) => ({ ...model, right: randomGifUpdate(model.right, action) }));

export const saga = iterable => Observable
  .merge(
    composeSaga(randomGifSaga, '[GifViewerType]')(iterable),
    iterable
      .filter(({ action }) => action.type === Actions.InitPair)
        .flatMap(() => Observable.of(
          { type: `${Actions.Left}.${RandomGifActions.RequestMore}`, payload: 'cat' },
          { type: `${Actions.Right}.${RandomGifActions.RequestMore}`, payload: 'dog' }
        ))
  );

// VIEW

export const View = ({ dispatch, model }) => (
  <div style={{display: 'flex'}}>
    <RandomGif dispatch={forwardTo(dispatch, Actions.Left)} model={model.left} />
    <RandomGif dispatch={forwardTo(dispatch, Actions.Right)} model={model.right} />
  </div>
);

View.propTypes = {
  dispatch: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired
};
