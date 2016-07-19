import { assert } from 'chai';

import MatchingReducer from '../../src/matching/MatchingReducer';

const Increment = 'Increment';
const Decrement = 'Decrement';
const INCREMENT_ACTION = { type: Increment };
const DECREMENT_ACTION = { type: Decrement };

const INITIAL_APP_STATE = 42;

const counterReducer = new MatchingReducer(INITIAL_APP_STATE)
  .case(Increment, appState => appState + 1)
  .case(Decrement, appState => appState - 1)
  .toReducer();

describe('MatchingReducer', () => {
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
    const reducer = new MatchingReducer(0)
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
});
