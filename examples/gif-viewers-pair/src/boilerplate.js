import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import reduxElm from 'redux-elm';

export default (containerDomId, View, updater) => {
  const storeFactory = compose(
    reduxElm,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = storeFactory(updater);
  setTimeout(() => store.dispatch({ type: 'Init' }));

  const ConnectedView = connect(appState => ({
    model: appState
  }))(View);

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
  ), document.getElementById(containerDomId));
};
