import React from 'react';

import forwardTo from '../elm/forwardTo';
import generatorMap from '../elm/generatorMap';
import { View as Counter, update as counterUpdate } from '../1-counter/main';

// UPDATE

const INSERT = 'INSERT';
const REMOVE = 'REMOVE';
const MODIFY = 'MODIFY';

const initialModel = {
  counters: [],
  nextId: 0
};

const insert = function*(model, action) {
  const { counters, nextId } = model;
  const newCounter = {
    id: nextId,
    model: yield* counterUpdate(undefined, action)
  };

  return {
    counters: [...counters, newCounter],
    nextId: nextId + 1
  };
};

const remove = function*(model) {
  const counters = [...model.counters];
  counters.pop();

  return {
    ...model,
    counters
  };
};

export const update = function* (model = initialModel, action) {
  const { type, payload } = action;

  switch (type) {
  case INSERT:
    return yield* insert(model, action);

  case REMOVE:
    return yield* remove(model);

  case MODIFY:
    return {
      ...model,
      counters: yield* generatorMap(model.counters, function*(counter) {
        if (counter.id === payload.type) {
          return {...counter, model: yield* counterUpdate(counter.model, payload.payload)};
        } else {
          return counter;
        }
      })
    };

  default:
    return model;
  }
};

// VIEW

const viewCounter = (dispatch, model, id) => <Counter key={id} dispatch={forwardTo(forwardTo(dispatch, MODIFY), id)} model={model} />;

export const View = ({dispatch, model}) => (
  <div>
    <button onClick={() => dispatch(REMOVE)}>Remove</button>
    <button onClick={() => dispatch(INSERT)}>Add</button>
    {model.counters.map(counter => viewCounter(dispatch, counter.model, counter.id))}
  </div>
);

