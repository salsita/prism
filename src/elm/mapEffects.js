import forwardTo from './forwardTo';

const unwindIterable = iterable => {
  const data = [];

  const recur = it => {
    const next = it.next();
    data.push(next.value);

    if (next.done) {
      return data;
    } else {
      return recur(it);
    }
  };

  return recur(iterable);
};

const last = arr => arr[arr.length - 1];

export default function*(updaterIterable, type) {
  const unwoundIterable = unwindIterable(updaterIterable);

  for (let i = 0; i < unwoundIterable.length - 1; i++) {
    yield dispatch => unwoundIterable[i](forwardTo(dispatch, type));
  }

  return last(unwoundIterable);
}
