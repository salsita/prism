import { Updater } from 'redux-elm';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import * as Effects from './effects';

const getTopic = model => model.topic;

function* fetchGif() {
  const topic = yield select(getTopic);
  const url = yield call(Effects.fetchGif, topic);
  yield put({ type: 'NewGif', url });
}

function* saga() {
  yield* takeEvery('RequestMore', fetchGif);
}

export const init = topic => ({
  topic,
  gifUrl: null
});

export default new Updater(init('funny cats'), saga)
  .case('NewGif', (model, { url }) => ({ ...model, gifUrl: url }))
  .case('RequestMore', model => ({ ...model, gifUrl: null }))
  .toReducer();
