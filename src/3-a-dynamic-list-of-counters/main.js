import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';

import createElmishStore from '../elm/createElmishStore';
import forwardTo from '../elm/forwardTo';
import { View as Counter, update as counterUpdate } from '../1-counter/main';

// UPDATE

const INSERT = 'INSERT';
const REMOVE = 'REMOVE';
const MODIFY = 'MODIFY';

const initialModel = {
  counters: [],
  nextId: 0
};

const insert = (model, action) => {
  const { counters, nextId } = model;
  const newCounter = {
    id: nextId,
    model: counterUpdate(undefined, action)
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

export const update = (model = initialModel, action) => {
  const { type, payload } = action;

  switch (type) {
  case INSERT:
    return insert(model, action);

  case REMOVE:
    return remove(model);

  case MODIFY:
    return {
      ...model,
      counters: model.counters.map(counter => {
        if (counter.id === payload.type) {
          return {...counter, model: counterUpdate(counter.model, payload.payload)};
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

export const View = ({dispatch, counters}) => (
  <div>
    <button onClick={() => dispatch(REMOVE)}>Remove</button>
    <button onClick={() => dispatch(INSERT)}>Add</button>
    {counters.map(counter => viewCounter(dispatch, counter.model, counter.id))}
  </div>
);

// MAIN

const ConnectedView = connect(model => model)(View);
const store = createElmishStore(update);
const Application = () => <Provider store={store}><ConnectedView /></Provider>;

render(<Application />, document.getElementById('app'));
