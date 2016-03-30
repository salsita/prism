import forwardTo from './forwardTo';
import * as Utils from './utils';
import { sideEffect } from 'redux-side-effects';

// TODO: docs & tests
export default function* mapEffects(iterable, ...types) {
  const unwoundIterable = Utils.unwindIterable(iterable);

  if (unwoundIterable.length > 1) {
    for (let i = 0; i < unwoundIterable.length - 2; i++) {
      const executor = unwoundIterable[i].shift();
      const mappedExecutor = dispatch => executor(forwardTo(dispatch, ...types));

      yield sideEffect(mappedExecutor, ...unwoundIterable[i]);
    }
  }

  return unwoundIterable[unwoundIterable.length - 1];
}