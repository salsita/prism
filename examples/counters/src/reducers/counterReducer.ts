import { Action } from 'redux';

export interface CounterState {
  value: number
};

export const initialState : CounterState = {
  value: 0
};

export default (state : CounterState = initialState, { type } : Action) : CounterState => {
  switch (type) {
    case 'Increment':
      return {
        ...state,
        value: state.value + 1
      };
    
    case 'Decrement':
      return {
        ...state,
        value: state.value - 1
      };
    
    default:
      return state;
  }
};
