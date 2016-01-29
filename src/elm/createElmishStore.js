import { compose, createStore } from 'redux';
import { createEffectCapableStore } from 'redux-side-effects';
import { devTools } from 'redux-devtools';

const elmEnhancer = storeFactory => (reducer, initialState) => {
  const store = storeFactory(reducer, initialState);

  return {
    ...store,
    dispatch: (type, payload = {}) => {
      if (typeof type === 'object') {
        return store.dispatch(type);
      } else {
        return store.dispatch({type, payload});
      }
    }
  };
};

export default (updater, initialState) => {
  const storeFactory = compose(
    createEffectCapableStore,
    elmEnhancer,
    devTools()
  )(createStore);

  return storeFactory(updater, initialState);
};
