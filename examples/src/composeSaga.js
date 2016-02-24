import { Observable } from 'rxjs';
import { wrap, unwrap } from 'redux-elm';

export default (saga, pattern) => iterable => {
  const compiledUnwrap = unwrap(pattern);

  return iterable
    .map(input => ({ ...input, action: compiledUnwrap(input.action) }))
    .filter(input => !!input.action)
    .flatMap(input => saga(Observable.of(input))
      .map(action => wrap(action, pattern, input.action.match)));
};
