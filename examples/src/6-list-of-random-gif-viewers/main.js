import React from 'react';
import { Observable } from 'rxjs';

import { patternMatch, forwardTo, composeSaga, unwrap, wrap } from 'redux-elm';
import { View as RandomGif, update as randomGifUpdate, saga as randomGifSaga } from '../4-random-gif-viewer/main';

// UPDATE

const Actions = {
  Create: 'Create',
  Topic: 'Topic',
  Submsg: 'Submsg'
};

const initialAppState = {
  topic: '',
  gifList: [],
  uid: 0
};

const create = model => {
  const { uid } = model;

  return {
    ...model,
    topic: '',
    gifList: [...model.gifList, {
      uid,
      model: randomGifUpdate()
    }],
    uid: model.uid + 1
  };
};

export const update = patternMatch(initialAppState)
  .case(Actions.Topic, (model, { payload }) => ({ ...model, topic: payload.topic }))
  .case(Actions.Create, create)
  .case(`${Actions.Submsg}.[GifViewerId]`, (model, action) => {
    return {
      ...model,
      gifList: model.gifList.map(gifModel => {
        if (gifModel.uid === parseInt(action.match.GifViewerId, 10)) {
          return {
            ...gifModel,
            model: randomGifUpdate(gifModel.model, action)
          };
        } else {
          return gifModel;
        }
      })
    };
  });

export const saga = iterable => Observable.merge(
  randomGifSaga(iterable)
);

// VIEW

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

export const View = ({dispatch, model}) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={model.topic}
      onKeyDown={ev => ev.keyCode === 13 ? dispatch({ type: Actions.Create, payload: ev.target.value }) : null}
      onChange={ev => dispatch({ type: Actions.Topic, payload: ev.target.value })}
      style={inputStyle} />
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {model.gifList.map(item => (
        <RandomGif
          key={item.uid}
          dispatch={forwardTo(dispatch, `${Actions.Submsg}.${item.uid}`)}
          model={item.model} />
      ))}
    </div>
  </div>
);
