import { createStore } from 'redux';

const elmEnhancer = storeFactory => (reducer, initialState) => {
  const store = storeFactory(reducer, initialState);

  return {
    ...store,
    dispatch: (type, payload) => store.dispatch({type, payload})
  };
};

export default (updater, initialState) => elmEnhancer(createStore)(updater, initialState);
