import { applyMiddleware, compose, createStore } from 'redux';
import { createEffectCapableStore, combineReducers } from 'redux-side-effects';
import { devTools } from 'redux-devtools';
import { syncHistory, routeReducer } from 'react-router-redux';


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

export default (updater, history, initialState) => {
  const reduxRouterMiddleware = syncHistory(history);

  const storeFactory = compose(
    createEffectCapableStore,
    elmEnhancer,
    applyMiddleware(reduxRouterMiddleware),
    devTools()
  )(createStore);

  const reducer = combineReducers({
    model: updater,
    routing: routeReducer
  });

  return storeFactory(reducer, initialState);
};
