import React from 'react';

import forwardTo from '../elm/forwardTo';
import mapEffects from '../elm/mapEffects';
import { View as RandomGif, update as randomGifUpdate } from '../5-random-gif-viewer/main';

// UPDATE

const INIT = 'INIT';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

export function* update(incomingModel, action) {
  const model = incomingModel || {
    left: yield* randomGifUpdate(undefined, action),
    right: yield* randomGifUpdate(undefined, action)
  };

  const { type, payload } = action;
  switch (type) {
  case INIT:
    return {
      left: yield* mapEffects(randomGifUpdate(model.left, action), LEFT),
      right: yield* mapEffects(randomGifUpdate(model.right, action), RIGHT)
    };

  case LEFT:
    return {
      ...incomingModel,
      left: yield* mapEffects(randomGifUpdate(model.left, payload), LEFT)
    };

  case RIGHT:
    return {
      ...incomingModel,
      right: yield* mapEffects(randomGifUpdate(model.right, payload), RIGHT)
    };

  default:
    return model;
  }
}

// VIEW

export const View = ({dispatch, model}) => (
  <div style={{display: 'flex'}}>
    <RandomGif dispatch={forwardTo(dispatch, LEFT)} model={model.left} />
    <RandomGif dispatch={forwardTo(dispatch, RIGHT)} model={model.right} />
  </div>
);
