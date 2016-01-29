// This is just for development

import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import createElmishStore from './elm/createElmishStore';
import forwardTo from './elm/forwardTo';
import mapEffects from './elm/mapEffects';

import { View as FirstExampleView, update as firstExampleUpdate } from './1-counter/main';
import { View as SecondExampleView, update as secondExampleUpdate } from './2-pair-of-counters/main';
import { View as ThirdExampleView, update as thirdExampleUpdate } from './3-a-dynamic-list-of-counters/main';
import { View as FourthExampleView, update as fourthExampleUpdate } from './4-a-fancier-list-of-counters/main';
import { View as FifthExampleView, update as fifthExampleUpdate } from './5-random-gif-viewer/main';
import { View as SixthExampleView, update as sixthExampleUpdate } from './6-pair-of-random-gif-viewers/main';
import { View as SeventhExampleView, update as seventhExampleUpdate } from './7-list-of-random-gif-viewers/main';

const INDEX_PAGE = '#/';
const EXAMPLE_1 = '#/1-counter';
const EXAMPLE_2 = '#/2-pair-of-counters';
const EXAMPLE_3 = '#/3-dynamic-list-of-counters';
const EXAMPLE_4 = '#/4-fancier-list-of-counters';
const EXAMPLE_5 = '#/5-random-gif-viewer';
const EXAMPLE_6 = '#/6-pair-of-random-gif-viewers';
const EXAMPLE_7 = '#/7-list-of-random-gif-viewers';

const initialModel = {
  page: INDEX_PAGE
};

const INIT = 'INIT';
const CHANGE_PAGE = 'CHANGE_PAGE';

const update = function*(model = initialModel, action) {
  const { type, payload } = action;

  switch (type) {
  case CHANGE_PAGE:
    return {
      page: payload,
      example1Model: yield* mapEffects(firstExampleUpdate(model.example1Model, action), EXAMPLE_1),
      example2Model: yield* mapEffects(secondExampleUpdate(model.example2Model, action), EXAMPLE_2),
      example3Model: yield* mapEffects(thirdExampleUpdate(model.example3Model, payload), EXAMPLE_3),
      example4Model: yield* mapEffects(fourthExampleUpdate(model.example4Model, payload), EXAMPLE_4),
      example5Model: yield* mapEffects(fifthExampleUpdate(model.example5Model, {type: INIT, payload: 'funny cats'}), EXAMPLE_5),
      example6Model: yield* mapEffects(sixthExampleUpdate(model.example6Model, {type: INIT, payload: 'funny cats'}), EXAMPLE_6),
      example7Model: yield* mapEffects(seventhExampleUpdate(model.example7Model, payload), EXAMPLE_7)
    };

  case EXAMPLE_1:
    return {
      ...model,
      example1Model: yield* mapEffects(firstExampleUpdate(model.example1Model, payload), EXAMPLE_1)
    };

  case EXAMPLE_2:
    return {
      ...model,
      example2Model: yield* mapEffects(secondExampleUpdate(model.example2Model, payload), EXAMPLE_2)
    };

  case EXAMPLE_3:
    return {
      ...model,
      example3Model: yield* mapEffects(thirdExampleUpdate(model.example3Model, payload), EXAMPLE_3)
    };

  case EXAMPLE_4:
    return {
      ...model,
      example4Model: yield* mapEffects(fourthExampleUpdate(model.example4Model, payload), EXAMPLE_4)
    };

  case EXAMPLE_5:
    return {
      ...model,
      example5Model: yield* mapEffects(fifthExampleUpdate(model.example5Model, payload), EXAMPLE_5)
    };

  case EXAMPLE_6:
    return {
      ...model,
      example6Model: yield* mapEffects(sixthExampleUpdate(model.example6Model, payload), EXAMPLE_6)
    };

  case EXAMPLE_7:
    return {
      ...model,
      example7Model: yield* mapEffects(seventhExampleUpdate(model.example7Model, payload), EXAMPLE_7)
    };

  default:
    return model;
  }
};

const IndexPage = ({ dispatch }) => (
  <ol>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_1)}>Counter</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_2)}>Pair of Counters</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_3)}>Dynamic list of counters</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_4)}>Fancier list of counters</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_5)}>Random GIF Viewer</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_6)}>Pair of random GIF Viewers</a></li>
    <li><a onClick={() => dispatch(CHANGE_PAGE, EXAMPLE_7)}>List of random GIF Viewers</a></li>
  </ol>
);

const View = ({ dispatch, page, example1Model, example2Model, example3Model, example5Model, example6Model, example7Model }) => {
  switch (page) {
  case INDEX_PAGE:
    return <IndexPage dispatch={dispatch} />;

  case EXAMPLE_1:
    return <FirstExampleView dispatch={forwardTo(dispatch, EXAMPLE_1)} model={example1Model} />;

  case EXAMPLE_2:
    return <SecondExampleView dispatch={forwardTo(dispatch, EXAMPLE_2)} model={example2Model} />;

  case EXAMPLE_3:
    return <ThirdExampleView dispatch={forwardTo(dispatch, EXAMPLE_3)} model={example3Model} />;

  case EXAMPLE_4:
    return <FourthExampleView dispatch={forwardTo(dispatch, EXAMPLE_4)} model={example4Model} />;

  case EXAMPLE_5:
    return <FifthExampleView dispatch={forwardTo(dispatch, EXAMPLE_5)} model={example5Model} />;

  case EXAMPLE_6:
    return <SixthExampleView dispatch={forwardTo(dispatch, EXAMPLE_6)} model={example6Model} />;

  case EXAMPLE_7:
    return <SeventhExampleView dispatch={forwardTo(dispatch, EXAMPLE_7)} model={example7Model} />;

  default:
    return false;
  }
};

const ConnectedView = connect(model => model)(View);
const store = createElmishStore(update);
const Application = () => (
  <div>
    <Provider store={store}><ConnectedView /></Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>
);

render(<Application />, document.getElementById('app'));
