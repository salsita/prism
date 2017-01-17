import { matcher as defaultMatcher } from './matchers';
import { warn } from '../utils/logger';

const identity = value => value;

/**
 * @class MatchingReducerFactory
 *
 * A simple pattern matching abstraction
 * for Redux reducers.
 */
export default class MatchingReducerFactory {

  /**
   * @param {any} Initial app state
   * @param {Matcher} Default Matcher implementation
   */
  constructor(initialAppState, defaultMatcherImpl = defaultMatcher) {
    this.defaultMatcherImpl = defaultMatcherImpl;
    this.initialAppState = initialAppState;
    this.matchersWithHandlers = [];
  }

  /**
   * Registers action handler
   *
   * @param {String} String pattern
   * @param {Function} Action Handler (reducer)
   * @param {Matcher} [Optional] Specific Matcher implementation
   */
  case(pattern, actionHandler, matcherImpl) {
    const matcher = matcherImpl ?
      matcherImpl(pattern) :
      this.defaultMatcherImpl(pattern);

    this.matchersWithHandlers.push({
      matcher,
      actionHandler
    });

    return this;
  }

  /**
   * Creates the Reducer
   *
   * @return {Function} plain old Redux reducer
   */
  toReducer() {
    return (appState = this.initialAppState, action) => {
      if (action) {
        if (!action.type) {
          // Logging is technically impurity yet this serves
          // just for developer to eliminate any potential issues
          // in development phase.
          warn('It looks like you have provided an invalid action. ' +
               'Make sure that the dispatched action has a type property ' +
               'or use se the appropriate middleware (e.g. redux-thunk) to ' +
               'translate non-standard actions into plain old Redux action objects.');

          return appState;
        }

        const parentId = action.matching ? `${action.matching.id}.` : '';
        const parentWrap = action.matching ? action.matching.wrap : identity;
        const parentArgs = action.args ? action.args : {};

        return this
          .matchersWithHandlers
          .map(({ matcher, actionHandler }) => ({
            matching: matcher(action),
            actionHandler
          }))
          .filter(({ matching }) => !!matching)
          .reduce((partialReduction, { matching: {
            id,
            wrap,
            unwrappedType,
            args
          }, actionHandler }) =>
            actionHandler(
              partialReduction,
              {
                ...action,
                type: unwrappedType,
                matching: {
                  id: `${parentId}${id}`,
                  wrap: type => parentWrap(wrap(type)),
                  args: Object.assign({}, parentArgs, args)
                }
              }
            ), appState);
      } else {
        return appState;
      }
    };
  }
}
