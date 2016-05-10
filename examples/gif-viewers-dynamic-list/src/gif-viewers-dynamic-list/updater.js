import { Updater, Matchers } from 'redux-elm';
import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import gifViewerUpdater,
  { init as gifViewerInit } from '../random-gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

function* saga() {
  yield* takeEvery('Create', function*() {
    const addedGifViewerIndex = yield select(model => model.gifViewers.length - 1);
    yield put({ type: `GifViewer.${addedGifViewerIndex}.RequestMore` });
  });
}

export default new Updater(initialModel, saga)
  .case('ChangeTopic', (model, { value }) => ({ ...model, topic: value }))
  .case('Create', model => ({
    ...model,
    topic: '',
    gifViewers: [...model.gifViewers, gifViewerInit(model.topic)]
  }))
  .case('GifViewer', (model, action, ...rest) => {
    const numericGifViewerIndex = parseInt(action.args.param, 10);

    return {
      ...model,
      gifViewers: model.gifViewers.map((gifViewerModel, index) => {
        if (index === numericGifViewerIndex) {
          return gifViewerUpdater(gifViewerModel, action, ...rest);
        } else {
          return gifViewerModel;
        }
      })
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
