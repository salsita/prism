import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { enhanceComponent } from 'prism';

import Counter from './Counter';
import { EventHandler } from '../commonTypes';
import { CounterState } from '../reducers/counterReducer';
import { CountersPairState } from '../reducers/countersPairReducer';

const topCounterSelector = (state : CountersPairState) : CounterState => state.top;
const bottomCounterSelector = (state : CountersPairState) : CounterState => state.bottom;

const topCounterWrapper = (type : string) => `Top.${type}`;
const bottomCounterWrapper = (type : string) => `Bottom.${type}`;

interface CountersPairProps {
  onReset: EventHandler
};

const InstantiableCounter = enhanceComponent<CountersPairState, CounterState>(Counter);

const CountersPair = ({ onReset } : CountersPairProps)  => (
  <div>
    <span>Top Counter</span>
    <InstantiableCounter
      selector={topCounterSelector}
      wrapper={topCounterWrapper}
    />
    <span>Bottom Counter</span>
    <InstantiableCounter
      selector={bottomCounterSelector}
      wrapper={bottomCounterWrapper}
    />
    <br />
    <button onClick={onReset}>Reset both</button>
  </div>
);

const mapDispatchToProps = (dispatch : Dispatch<CountersPairState>) : CountersPairProps => ({
  onReset: () => dispatch({ type: 'ResetCounters' })
});

export default connect(
  null,
  mapDispatchToProps
)(CountersPair);
