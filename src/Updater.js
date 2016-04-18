import defaultMacher from './matchers/matcher';
import * as Utils from './utils';
import * as Generators from './generators';

/**
 * @class Updater
 *
 * Simple abstraction which mimics behaviour of Elm Updater.
 * Updater should be converted to Redux Reducer by calling `toReducer` to make it compatible with
 * plain old Redux.
 *
 * Updater is responsible for matching action with corresponding updater function. redux-elm
 * ships with three basic matching implementations:
 *
 * 1) Matcher - This is default matcher. Action type must start with provided pattern, the tail which does not match the pattern is considered
 *              as "sub-action" and is passed as second argument to corresponding updater function.
 *              Example: pattern Foo matches these actions:
 *                - Foo.Bar
 *                - Foo.Baz
 *                - Foo.Bar.Baz
 *                - Foo.....
 *
 * 2) ExactMatcher - Action type must exactly match the provided pattern, there's no "sub-action" concept
 *                   it's just like a plain old switch in Redux application.
 *                   Example: pattern Foo matches only action Foo, therefore action Foo.Bar will not match
 *
 * 3) ParameterizedMatcher - Action type is splitted into three parts Pattern.Parameter.SubAction
 *                           Therefore action type must start with provided pattern (same like Matcher) and unwraps the "sub-action" (same like Matcher).
 *                           However, very important part of the action is Parameter in the middle which is something dynamic. This matching implementation helps with
 *                           dynamic lists of component like for example list of Counters.
 *                           Parameter is provided as third argument to updater.
 *                           Example:
 *                           Pattern Counters will match:
 *                           { type: Counters.1.Increment }
 *                           { type: Counters.2.Increment }
 *                           { type: Counters.XYZ.Increment }
 *                           { type: Counters.XYZ.Decrement }
 *                           { type: Counters.XYZ.Decrement.Foo }
 *                           etc. and the updater function would look like:
 *
 *                           function* updater(model, action, counterId) {
 *                             // counterId would be: 1 or 2 or XYZ
 *                             // action would be { type: 'Increment' } or { type: 'Decrement' } or { type: 'Decrement.Foo'}
 *                           }
 */
export default class Updater {

  /**
   * @constructor
   * @param {Any} Init Generator function or Initial model
   * @param {Function} Default Matcher implementation
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
