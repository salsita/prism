import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { EventHandler } from '../commonTypes';
import { CounterState } from '../reducers/counterReducer';

interface CounterPropsFromState {
  value: number
};

interface CounterPropsFromDispatch {
  onIncrement: EventHandler,
  onDecrement: EventHandler
};

interface CounterProps extends CounterPropsFromState, CounterPropsFromDispatch {};

const Counter = ({ onDecrement, onIncrement, value } : CounterProps) => (
  <div>
    <button onClick={onDecrement}>-</button>
    <span>{value}</span>
    <button onClick={onIncrement}>+</button>
  </div>
);

const mapStateToProps = (state : CounterState) : CounterPropsFromState => ({
  value: state.value
});

const mapDispatchToProps = (dispatch : Dispatch<CounterState>) : CounterPropsFromDispatch => ({
  onIncrement: () => dispatch({ type: 'Increment' }),
  onDecrement: () => dispatch({ type: 'Decrement' })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
