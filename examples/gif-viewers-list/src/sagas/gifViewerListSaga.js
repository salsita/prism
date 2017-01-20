import { parameterizedUnwrapper, spawn } from 'redux-elm';
import { put, fork, takeEvery, select } from 'redux-saga/effects';

import gifViewerSaga from './gifViewerSaga';

export default function* () {
  yield takeEvery('Create', function* () {
    const gifViewerId = yield select(state => state.gifViewers.length - 1);

    yield fork(
      spawn,
      parameterizedUnwrapper('GifViewer'),
      type => `GifViewer.${gifViewerId}.${type}`,
      state => state.gifViewers[gifViewerId],
      gifViewerSaga
    );

    yield put({ type: `GifViewer.${gifViewerId}.RequestMore` });
  });
}
