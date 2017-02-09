export interface Action {
  type: string
}

export interface Matcher {
  (action : Action) : Action
};

export interface Handler<S> {
  (state : S, action : Action) : S
};

export interface HandlerMatcherPair<S> {
  matcher: Matcher,
  handler: Handler<S>
};

export default <S>(...handlers : Array<HandlerMatcherPair<S>>) =>
  (initialState : S) =>
  (state : S = initialState, action : Action) : S =>
    handlers
    .map(({ matcher, handler }) => ({ match: matcher(action), handler }))
    .filter(({ match }) => !!match)
    .reduce((currentState, { match, handler }) => handler(currentState, match), state);
