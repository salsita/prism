import { assert } from 'chai';

import MatchingReducerFactory from '../../src/matching/MatchingReducerFactory';

const Increment = 'Increment';
const Decrement = 'Decrement';
const INCREMENT_ACTION = { type: Increment };
const DECREMENT_ACTION = { type: Decrement };
const INCREMENT_ACTION_WITH_PARENT = { type: Increment, matching: { id: 'Parent', wrap: t => t } };

const INITIAL_APP_STATE = 42;

const counterReducer = new MatchingReducerFactory(INITIAL_APP_STATE)
  .case(Increment, appState => appState + 1)
  .case(Decrement, appState => appState - 1)
  .toReducer();

describe('MatchingReducerFactory', () => {
  it('should match the appropriate action handlers', () => {
    let state = counterReducer();
    state = counterReducer(state, INCREMENT_ACTION);
    assert.equal(state, INITIAL_APP_STATE + 1);
    state = counterReducer(state, DECREMENT_ACTION);
    assert.equal(state, INITIAL_APP_STATE);
  });

  it('should return initial state when no action is provided', () => {
    assert.equal(counterReducer(), INITIAL_APP_STATE);
  });

  it('should return original reference to state when invalid action is dispatched', () => {
    const state = {};
    const referenceToMutatedState = counterReducer(state, () => {});

    // Reference should remain the same
    assert.equal(state, referenceToMutatedState);
  });

  it('should allow providing more than one action handler for the same pattern', () => {
    const reducer = new MatchingReducerFactory(0)
      .case(Increment, appState => appState + 1)
      .case(Increment, appState => appState + 1)
      .toReducer();

    assert.equal(reducer(undefined, INCREMENT_ACTION), 2);
  });

  it('should return original reference to state when action does not match', () => {
    const state = {};
    const referenceToMutatedState = counterReducer(state, { type: 'FooBar' });

    assert.equal(state, referenceToMutatedState);
  });

  it('should provide correct action matching id', () => {
    let matchingResult;

    const reducer = new MatchingReducerFactory(0)
      .case(Increment, (appState, { matching }) => {
        matchingResult = matching;
        return appState + 1;
      })
      .toReducer();

    reducer(undefined, INCREMENT_ACTION);

    assert.equal(matchingResult.id, Increment);
  });

  it('should provide correct action matching id when action parent exists', () => {
    let matchingResult;

    const reducer = new MatchingReducerFactory(0)
      .case(Increment, (appState, { matching }) => {
        matchingResult = matching;
        return appState + 1;
      })
      .toReducer();

    reducer(undefined, INCREMENT_ACTION_WITH_PARENT);

    assert.equal(matchingResult.id, `Parent.${Increment}`);
  });
});
