/* @flow */

import { matcher as defaultMatcher } from './matchers';
import { warn } from '../utils/logger';

const identity = value => value;

export default class MatchingReducerFactory {

  constructor(initialAppState, defaultMatcherImpl = defaultMatcher) {
    this.defaultMatcherImpl = defaultMatcherImpl;
    this.initialAppState = initialAppState;
    this.matchersWithHandlers = [];
  }

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

        const parentId = action.matching ? action.matching.id : '';
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
                  args: Object.assign(parentArgs, args)
                }
              }
            ), appState);
      } else {
        return appState;
      }
    };
  }
}
