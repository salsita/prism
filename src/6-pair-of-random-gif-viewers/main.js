import React from 'react';

import forwardTo from '../elm/forwardTo';
import mapEffects from '../elm/mapEffects';
import { View as RandomGif, update as randomGifUpdate, init as initRandomGifUpdate } from '../5-random-gif-viewer/main';

// UPDATE

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

export function* init(topic) {
  return {
    left: yield* mapEffects(initRandomGifUpdate(topic), LEFT),
    right: yield* mapEffects(initRandomGifUpdate(topic), RIGHT)
  };
}

export function* update(model = {}, action) {
  const { type, payload } = action;

  switch (type) {
  case LEFT:
    return {
      ...model,
      left: yield* mapEffects(randomGifUpdate(model.left, payload), LEFT)
    };

  case RIGHT:
    return {
      ...model,
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
