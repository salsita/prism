import { Action, Handler, Unwrapper } from './types';

export interface UnwrapperHandlerPair<S> {
  unwrapper: Unwrapper,
  handler: Handler<S>
};

export default <S>(...handlers : Array<UnwrapperHandlerPair<S>>) =>
  (initialState : S) =>
  (state : S = initialState, action : Action) : S =>
    handlers
    .map(({ unwrapper, handler }) => ({ unwrappedAction: unwrapper(action), handler }))
    .filter(({ unwrappedAction }) => !!unwrappedAction)
    .reduce((currentState, { unwrappedAction, handler }) => handler(currentState, unwrappedAction!), state);
