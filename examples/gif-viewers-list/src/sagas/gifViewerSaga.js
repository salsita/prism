import { call } from 'redux-saga/effects';

import * as Api from '../effects/api';

function* onRequestMore(action, put, select) {
  const topic = yield select(state => state.topic);
  const url = yield call(Api.fetchGif, topic);
  yield put({ type: 'NewGif', payload: url });
}

export default function* (action, put, select) {
  switch (action.type) {
    case 'RequestMore':
      yield call(onRequestMore, action, put, select);
      break;
    default:
      // noop
  }
}
