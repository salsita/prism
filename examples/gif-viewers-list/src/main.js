import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import GifViewerList from './components/GifViewerList';
import gifViewerListReducer from './reducers/gifViewerListReducer';
import gifViewerListSaga from './sagas/gifViewerListSaga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(gifViewerListReducer, compose(
  applyMiddleware(sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : value => value
));

sagaMiddleware.run(gifViewerListSaga);

render(
  <Provider store={store}>
    <GifViewerList />
  </Provider>,
  document.getElementById('app')
);
