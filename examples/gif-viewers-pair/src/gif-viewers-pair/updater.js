import { Updater } from 'redux-elm';
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import gifViewerUpdater, { init as gifViewerInit } from '../random-gif-viewer/updater';

const initialModel = {
  top: gifViewerInit('funny cats'),
  bottom: gifViewerInit('funny dogs')
};

function* saga() {
  yield* takeEvery('Load', function*() {
    yield put({ type: 'Top.RequestMore' });
    yield put({ type: 'Bottom.RequestMore' });
  });
}

export default new Updater(initialModel, saga)
  .case('Top', (model, ...rest) =>
    ({ ...model, top: gifViewerUpdater(model.top, ...rest) }))
  .case('Bottom', (model, ...rest) =>
    ({ ...model, bottom: gifViewerUpdater(model.bottom, ...rest) }))
  .toReducer();
