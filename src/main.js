import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { routeActions, UPDATE_LOCATION } from 'react-router-redux';
import { Router, Route } from 'react-router';
import { createHashHistory } from 'history';

import createElmishStore from './elm/createElmishStore';
import forwardTo from './elm/forwardTo';
import mapEffects from './elm/mapEffects';

import { View as FirstExampleView, update as firstExampleUpdate } from './1-counter/main';
import { View as SecondExampleView, update as secondExampleUpdate } from './2-pair-of-counters/main';
import { View as ThirdExampleView, update as thirdExampleUpdate } from './3-a-dynamic-list-of-counters/main';
import { View as FourthExampleView, update as fourthExampleUpdate } from './4-a-fancier-list-of-counters/main';
import { View as FifthExampleView, update as fifthExampleUpdate, init as fifthInit } from './5-random-gif-viewer/main';
import { View as SixthExampleView, update as sixthExampleUpdate, init as sixthInit } from './6-pair-of-random-gif-viewers/main';
import { View as SeventhExampleView, update as seventhExampleUpdate } from './7-list-of-random-gif-viewers/main';

const INDEX_PAGE = '/';
const INIT = 'INIT';

const EXAMPLE_1 = {
  id: '/1-counter',
  title: 'Counter',
  View: FirstExampleView,
  update: firstExampleUpdate
};

const EXAMPLE_2 = {
  id: '/2-counter',
  title: 'Pair of Counters',
  View: SecondExampleView,
  update: secondExampleUpdate
};

const EXAMPLE_3 = {
  id: '/3-counter',
  title: 'Dynamic list of Counters',
  View: ThirdExampleView,
  update: thirdExampleUpdate
};

const EXAMPLE_4 = {
  id: '/4-a-fancier-list-of-counters',
  title: 'Fancier list of Counters',
  View: FourthExampleView,
  update: fourthExampleUpdate
};

const EXAMPLE_5 = {
  id: '/5-random-gif-viewer',
  title: 'Random GIF Viewer',
  View: FifthExampleView,
  update: fifthExampleUpdate
};

const EXAMPLE_6 = {
  id: '/6-pair-of-random-gif-viewers',
  title: 'Pair of random GIF Viewers',
  View: SixthExampleView,
  update: sixthExampleUpdate
};

const EXAMPLE_7 = {
  id: '/7-list-of-random-gif-viewers',
  title: 'List of random GIF Viewers',
  View: SeventhExampleView,
  update: seventhExampleUpdate
};

const PAGES = [
  EXAMPLE_1,
  EXAMPLE_2,
  EXAMPLE_3,
  EXAMPLE_4,
  EXAMPLE_5,
  EXAMPLE_6,
  EXAMPLE_7
];

const initialModel = {
  page: INDEX_PAGE
};

const update = function*(model = initialModel, action) {
  const { type, payload } = action;

  if (type === UPDATE_LOCATION) {
    const { pathname } = payload;
    const view = PAGES.find(page => page.id === pathname);

    switch (pathname) {
    case EXAMPLE_1.id:
    case EXAMPLE_2.id:
    case EXAMPLE_3.id:
    case EXAMPLE_4.id:
    case EXAMPLE_7.id:
      return {
        ...model,
        [view.id]: yield* mapEffects(view.update(model[view.id], action), pathname)
      };

    case EXAMPLE_5.id:
      return {
        ...model,
        [view.id]: yield* mapEffects(fifthInit('funny cats'), pathname)
      };

    case EXAMPLE_6.id:
      return {
        ...model,
        [view.id]: yield* mapEffects(sixthInit('funny cats'), pathname)
      };


    default:
      return model;
    }
  } else {
    const view = PAGES.find(page => page.id === type);

    if (view) {
      return {
        ...model,
        [view.id]: yield* mapEffects(view.update(model[view.id], payload), type)
      };
    } else {
      return model;
    }
  }
};

const IndexPage = ({ dispatch }) => (
  <ol>
    {PAGES.map(view => <li><a onClick={() => dispatch(routeActions.push(view.id))}>{view.title}</a></li>)}
  </ol>
);

const ConnectedIndexPage = connect(() => ({}))(props => <IndexPage {...props} />);

const buildComponent = page => connect(appState => ({model: appState.model[page.id]}))(
  ({model, dispatch}) => <page.View dispatch={forwardTo(dispatch, page.id)} model={model} />);

const MainView = ({ history }) => {
  return (
    <Router history={history}>
      <Route path={INDEX_PAGE} component={ConnectedIndexPage} />
      <Route path={INDEX_PAGE}>
        {PAGES.map(page => <Route path={page.id} component={buildComponent(page)} />)}
      </Route>
    </Router>
  );
};

const history = createHashHistory();
const store = createElmishStore(update, history);

const Application = () => (
  <div>
    <Provider store={store}>
      <MainView history={history} />
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>
);

render(<Application />, document.getElementById('app'));
