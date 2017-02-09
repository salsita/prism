import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import countersPairReducer from './reducers/countersPairReducer';
import CountersPair from './components/CountersPair';

const store = createStore(countersPairReducer);

render((
  <Provider store={store}>
    <CountersPair />
  </Provider>
), document.getElementById('root'));
