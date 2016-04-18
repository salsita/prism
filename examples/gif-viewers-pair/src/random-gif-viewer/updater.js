import { Updater, Matchers } from 'redux-elm';
import { sideEffect } from 'redux-side-effects';

import * as Effects from './effects';

export function init(topic) {
  return function*() {
    yield sideEffect(Effects.fetchGif, topic);

    return {
      topic,
      gifUrl: null
    };
  };
};

export function* fetchGif(model) {
  yield sideEffect(Effects.fetchGif, model.topic);

  return {
    ...model,
    gifUrl: null
  };
};

export default new Updater(init('funny cats'), Matchers.exactMatcher)
  .case('NewGif', function*(model, action) {
    return {
      ...model,
      gifUrl: action.url
    }
  })
  .case('RequestMore', fetchGif)
  .toReducer();