import { Updater, mapEffects, Matchers } from 'redux-elm';

import gifViewerUpdater, { init as gifViewerInit, fetchGif } from '../random-gif-viewer/updater';

const funnyCatsGifViewerInit = gifViewerInit('funny cats');
const funnyDogsGifViewerInit = gifViewerInit('funny dogs');

export function* init() {
  return {
    top: yield* mapEffects(funnyCatsGifViewerInit(), 'Top'),
    bottom: yield* mapEffects(funnyDogsGifViewerInit(), 'Bottom')
  };
}

export default new Updater(init)
  .case('Top', function*(model, action) {
    return {
      ...model,
      top: yield* mapEffects(gifViewerUpdater(model.top, action), 'Top')
    };
  })
  .case('Bottom', function*(model, action) {
    return {
      ...model,
      bottom: yield* mapEffects(gifViewerUpdater(model.bottom, action), 'Bottom')
    };
  })
  .case('Load', function*(model, action) {
    return {
      ...model,
      top: yield* mapEffects(fetchGif(model.top), 'Top'),
      bottom: yield* mapEffects(fetchGif(model.bottom), 'Bottom')
    }
  }, Matchers.exactMatcher)
  .toReducer();
