import { Observable } from 'rxjs';
import wrap from './wrap';
import unwrap from './unwrap';

// TODO: opinionated

export default (saga, pattern) => iterable => iterable
  .filter(({ action }) => !!unwrap(action, pattern))
  .flatMap(input => {
    const unwrapped = unwrap(input.action, pattern);

    return saga(Observable.of({ ...input, action: unwrapped }))
      .map(action => wrap(action, pattern, unwrapped.match));
  });
