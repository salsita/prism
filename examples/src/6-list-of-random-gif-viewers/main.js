import React, { PropTypes } from 'react';
import { Observable } from 'rxjs';

import { patternMatch, forwardTo } from 'redux-elm';
import { View as RandomGif, update as randomGifUpdate, saga as randomGifSaga } from '../4-random-gif-viewer/main';
import composeSaga from '../composeSaga';

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

const create = (model, { payload }) => {
  const { uid } = payload;

  return {
    ...model,
    topic: '',
    gifList: [...model.gifList, {
      uid,
      model: randomGifUpdate()
    }],
    uid: uid + 1
  };
};

export const update = patternMatch(initialAppState)
  .case(Actions.Topic, (model, { payload }) => ({ ...model, topic: payload }))
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
  iterable
    .filter(({ action }) => action.type === Actions.Create)
    .map(({ action }) => ({ type: `${Actions.Submsg}.${action.payload.uid}.RequestMore`, payload: action.payload.value })),
  composeSaga(randomGifSaga, 'Submsg.[GifViewerId]')(iterable)
);

// VIEW

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

export const View = ({ dispatch, model }) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={model.topic}
      onKeyDown={ev => ev.keyCode === 13 ? dispatch({ type: Actions.Create, payload: { value: ev.target.value, uid: model.uid } }) : null}
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

View.propTypes = {
  dispatch: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired
};
