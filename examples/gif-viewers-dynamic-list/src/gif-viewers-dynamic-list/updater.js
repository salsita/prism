import { Updater, Matchers, mapEffects, Generators } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit } from '../random-gif-viewer/updater';

const initialModel = {
  topic: '',
  gifViewers: []
};

export default new Updater(initialModel)
  .case('ChangeTopic', function*(model, action) {
    return {
      ...model,
      topic: action.value
    };
  }, Matchers.exactMatcher)
  .case('Create', function*(model) {
    const topicSpecificInitGifViewer = gifViewerInit(model.topic);

    return {
      ...model,
      topic: '',
      gifViewers: [
        ...model.gifViewers,
        yield* mapEffects(topicSpecificInitGifViewer(), 'GifViewer', model.gifViewers.length)
      ]
    };
  }, Matchers.exactMatcher)
  .case('GifViewer', function*(model, action, gifViewerIndex) {
    const numericGifViewerIndex = parseInt(gifViewerIndex, 10);

    const gifViewers = yield* Generators.map(model.gifViewers, function*(gifViewerModel, index) {
      if (index === numericGifViewerIndex) {
        return yield* mapEffects(gifViewerUpdater(gifViewerModel, action), 'GifViewer', index);
      } else {
        return gifViewerModel;
      }
    });

    return {
      ...model,
      gifViewers
    };
  }, Matchers.parameterizedMatcher)
  .toReducer();
