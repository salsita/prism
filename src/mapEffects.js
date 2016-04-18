import forwardTo from './forwardTo';
import * as Utils from './utils';
import { sideEffect } from 'redux-side-effects';

// TODO: docs & tests
export default function* mapEffects(iterable, ...types) {
  const unwoundIterable = Utils.unwindIterable(iterable);

  if (unwoundIterable.length > 1) {
    for (let i = 0; i < unwoundIterable.length - 1; i++) {
      const executor = unwoundIterable[i].shift();
      const mappedExecutor = (dispatch, ...executorArgs) => executor(forwardTo(dispatch, ...types), ...executorArgs);

      yield sideEffect(mappedExecutor, ...(unwoundIterable[i]));
    }
  }

  return unwoundIterable[unwoundIterable.length - 1];
}
