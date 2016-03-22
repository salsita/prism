import defaultMacher from './matchers/matcher';
import * as Utils from './utils';
import * as Generators from './generators';

/**
 * @class Updater
 *
 * Simple abstraction which mimics behaviour of Elm Updater.
 * Updater should be converted to Redux Reducer by calling `toReducer` to make it compatible with
 * plain old Redux.
 */
export default class Updater {

  /**
   * @constructor
   * @param {Any} Init Generator function or initial model
   * @param {Function} Default matcher implementation
   */
  constructor(init, defaultMatcherImpl = defaultMacher) {
    if (Utils.isFunction(init) && !Utils.isGenerator(init)) {
      throw new Error('Init can\'t be just a function, it must be Generator');
    }

    this.init = init;
    this.defaultMatcherImpl = defaultMatcherImpl;
    this.matchers = [];
  }

  /**
   * Registers updater with corresponding pattern. May optionally provide
   * Matcher implementation, default is Exact Matcher.
   *
   * @param {String} A pattern to match
   * @param {Function} Reducer in form of generator
   * @param {Function} A matcher to be used for matching, default is ExactMatcher
   *
   * @return {Updater}
   */
  case(pattern, updater, matcherImpl) {
    if (!Utils.isGenerator(updater)) {
      throw new Error('Provided updater must be a Generator function');
    }

    const matcher = matcherImpl ? matcherImpl(pattern) : this.defaultMatcherImpl(pattern);
    this.matchers.push({ matcher, updater });

    return this;
  }

  /**
   * Converts Updater to Redux compatible Reducer.
   * You always need to call this method before exporting the Updater.
   */
  toReducer() {
    const { init, matchers } = this;

    function* initializeReduction(reduction) {
      if (!reduction) {
        if (Utils.isGenerator(init)) {
          return yield* init();
        } else {
          return init;
        }
      } else {
        return reduction;
      }
    }

    return function* reducer(inputReduction, action) {
      const reduction = yield* initializeReduction(inputReduction);

      if (action) {
        const matchingMatchers = matchers
          .map(({ matcher, updater }) => ({ match: matcher(action), updater }))
          .filter(({ match }) => !!match);

        return yield* Generators.reduce(matchingMatchers, function* matcherReducer(partialReduction, { match, updater }) {
          const matchCpy = [...match];
          const tail = matchCpy.splice(1);

          return yield* updater(partialReduction, { ...action, type: matchCpy[0] }, ...tail);
        }, reduction);
      } else {
        return reduction;
      }
    };
  }
}
