export default (...rawHandlers) => {
  const handlers = rawHandlers.slice(0, -1);
  const initialState = rawHandlers[rawHandlers.length - 1];

  return (state = initialState, action) => handlers
    .map(([matcher, handler]) => ({ match: matcher(action), handler }))
    .filter(({ match }) => !!match)
    .reduce((currentState, { match, handler }) => handler(currentState, match), state);
};
