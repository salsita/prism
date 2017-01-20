import { take, put, select, call } from 'redux-saga/effects';

const buildPut = wrapper =>
  action =>
    put({
      ...action,
      type: wrapper(action.type)
    });

const buildSelect = selector =>
  nestedSelector =>
  select(appState =>
    nestedSelector(selector(appState)));

export default function* spawn(
  unwrapper,
  wrapper,
  selector,
  saga
) {
  while (true) {
    const action = yield take(unwrapper);
    const unwrapped = unwrapper(action);

    yield call(
      saga,
      unwrapped,
      buildPut(wrapper),
      buildSelect(selector)
    );
  }
}
