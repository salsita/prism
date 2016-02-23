import React from 'react';
import request from 'superagent-bluebird-promise';
import { Observable } from 'rxjs';
import { patternMatch } from 'redux-elm';

// EFFECTS

const randomUrl = topic => `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`;
export const getRandomGif = topic => request.get(randomUrl(topic));

// UPDATE

const Actions = {
  RequestMore: 'RequestMore',
  NewGif: 'NewGif'
};

const initialModel = {
  topic: '',
  gifUrl: 'assets/waiting.gif'
};

export const saga = iterable => iterable
  .filter(({ action }) => action.type === Actions.RequestMore)
  .flatMap(({ action }) => Observable
    .fromPromise(getRandomGif(action.payload))
    .map(response => ({
      type: Actions.NewGif,
      payload: {
        url: response.body.data.image_url,
        topic: action.payload
      }
    })));

export const update = patternMatch(initialModel)
  .case(Actions.NewGif, (model, { payload }) => ({ ...model, gifUrl: payload.url, topic: payload.topic }));

// VIEW

const headerStyle = () => ({
  width: '200px',
  textAlign: 'center'
});

const imgStyle = url => ({
  display: 'inline-block',
  width: '200px',
  height: '200px',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundImage: `url('${url}')`
});

export const View = ({dispatch, model}) => (
  <div style={{width: '200px'}}>
    <h2 style={headerStyle()}>{model.topic}</h2>
    <div style={imgStyle(model.gifUrl)}></div>
    <button onClick={() => dispatch({ type: Actions.RequestMore, payload: model.topic })}>More Please!</button>
  </div>
);

