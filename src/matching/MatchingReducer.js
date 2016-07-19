import { matcher as defaultMatcher } from './matchers';
import { warn } from '../utils/logger';

export default class MatchingReducer {

  constructor(initialAppState, defaultMatcherImpl = defaultMatcher) {
    this.defaultMatcherImpl = defaultMatcherImpl;
    this.initialAppState = initialAppState;
    this.matchersWithHandlers = [];
  }

  case(pattern, actionHandler, matcherImpl = undefined) {
    const matcher = matcherImpl ?
      matcherImpl(pattern) :
      this.defaultMatcherImpl(pattern);

    this.matchersWithHandlers.push({
      matcher,
      actionHandler
    });

    return this;
  }

  toReducer() {
    return (appState = this.initialAppState, action) => {
      if (action) {
        if (!action.type) {
          // Logging is technically impurity yet this serves
          // just for developer to eliminate any potential issues
          // in development phase.
          warn('It looks like you have provided invalid action. ' +
               'Please make sure that you have dispatched an object with at least ' +
               'one field (type) identifiying type of the dispatched action. Or ' +
               'make sure that you are using appropriate middleware (eg. redux-thunk) ' +
               'which translates non-standard actions to plain old Redux actions in ' +
               'form of objects.');

          return appState;
        }

        return this
          .matchersWithHandlers
          .map(({ matcher, actionHandler }) => ({
            match: matcher(action),
            actionHandler
          }))
          .filter(({ match }) => !!match)
          .reduce((partialReduction, { match: { wrap, args, unwrap }, actionHandler }) =>
            actionHandler(
              partialReduction,
              {
                ...action,
                type: unwrap,
                matching: {
                  args,
                  wrap: `${(action.wrap || '')}${wrap}`
                }
              }
            ), appState);
      } else {
        return appState;
      }
    };
  }
}
