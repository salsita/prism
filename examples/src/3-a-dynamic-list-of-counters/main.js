import React from 'react';

import { patternMatch, forwardTo } from 'redux-elm';
import { View as Counter, update as counterUpdate } from '../1-counter/main';

// UPDATE

const Actions = {
  Insert: 'Insert',
  Remove: 'Remove',
  Counter: 'Counter'
};

const initialModel = {
  counters: [],
  nextId: 0
};

const insert = model => {
  const { counters, nextId } = model;
  const newCounter = {
    id: nextId,
    model: counterUpdate()
  };

  return {
    counters: [...counters, newCounter],
    nextId: nextId + 1
  };
};

const remove = model => {
  const counters = [...model.counters];
  counters.pop();

  return {
    ...model,
    counters
  };
};

export const update = patternMatch(initialModel)
  .case(Actions.Insert, insert)
  .case(Actions.Remove, remove)
  .case(`${Actions.Counter}.[CounterId]`, (model, action) => {
    return {
      ...model,
      counters: model.counters.map(counter => {
        if (counter.id === parseInt(action.match.CounterId, 10)) {
          return { ...counter, model: counterUpdate(counter.model, action) };
        } else {
          return counter;
        }
      })
    };
  });

// VIEW

const viewCounter = (dispatch, model, id) => <Counter key={id} dispatch={forwardTo(dispatch, `${Actions.Counter}.${id}`)} model={model} />;

export const View = ({dispatch, model}) => (
  <div>
    <button onClick={() => dispatch({ type: Actions.Remove })}>Remove</button>
    <button onClick={() => dispatch({ type: Actions.Insert })}>Add</button>
    {model.counters.map(counter => viewCounter(dispatch, counter.model, counter.id))}
  </div>
);

