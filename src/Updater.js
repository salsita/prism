import Matcher from './matchers/Matcher';
import ExactMatcher from './matchers/ExactMatcher';
import UnwrapMatcher from './matchers/UnwrapMatcher';
import DynamicUnwrapMatcher from './matchers/DynamicUnwrapMatcher';
import * as Utils from './utils';
import * as Generators from './generators';

/**
 * @class Updater
 *
 * Simple abstraction which mimics behaviour of Elm Updater.
 * You can extend it and provide your own matching implementation by registering custom Matchers.
 * Updater should be converted to Redux Reducer by calling `toReducer` to make it compatible with
 * plain old Redux.
 */
export default class Updater {

  /**
   * @constructor
   * @param {Any} Init Generator function or initial model
   */
  constructor(init) {
    if (Utils.isFunction(init) && !Utils.isGenerator(init)) {
      throw new Error('Init can\'t be just a function, it must be Generator');
    }

    this.init = init;
    this.matchers = [];
  }

  /**
   * Registers provided matcher and updater.
   *
   * @protected
   * @param {Matcher} Matcher instance
   * @param {Function} Generator function which is used as updater when Matcher matches action
   *
   * @return {Updater} Updater
   */
  registerMatcher(matcher, updater) {
    if (!(matcher instanceof Matcher)) {
      throw new Error('Provided matcher is not instance of Matcher');
    }

    if (!Utils.isGenerator(updater)) {
      throw new Error('Provided updater must be a Generator function');
    }

    this.matchers.push({ matcher, updater });

    return this;
  }

  /**
   * Exact pattern matching
   * Pattern 'Foo' matches only action 'Foo'
   *
   * @param {String} Action Pattern
   * @param {Function} Generator Updater
   */
  caseExact(pattern, updater) {
    return this.registerMatcher(new ExactMatcher(pattern), updater);
  }

  /**
   * Matches action starting with pattern and unwraps the tail of the action: [Pattern].[UnwrappedTail]
   * Pattern 'Foo' matches any action starting with 'Foo' and provides
   * the tail as unwrapped action. For example pattern 'Foo' and
   * action 'Foo.Bar' would match and provided action argument in
   * updater function would be 'Bar'
   *
   * @param {String} Action Pattern
   * @param {Function} Generator Updater
   */
  caseUnwrap(pattern, updater) {
    return this.registerMatcher(new UnwrapMatcher(pattern), updater);
  }

  /**
   * Action is split into three parts: [Pattern].[DynamicPart].[UnwrappedTail]
   * 1) Pattern provided as function argument, action must start with this pattern
   * 2) Dynamic part is considered a parameter for the action
   * 3) Tail of the action
   *
   * This is especially very handy for handling dynamic components.
   * Pattern `Counters` will match for example:
   * - 'Counters.1.Increment'
   * - 'Counters.2.Increment'
   * - 'Counters.1.Decrement'
   * - 'Counters.XXX.XYZ'
   *
   * Updater gets unwrapped action and the dynamic part:
   *
   * function* updater(model, action, counterId) {
   *   // action type is 'Increment' or 'Decrement'...
   *   // counterId is 1 or 2...
   * }
   *
   * @param {String} Action Pattern
   * @param {Function} Generator Updater
   */
  caseDynamicUnwrap(pattern, updater) {
    return this.registerMatcher(new DynamicUnwrapMatcher(pattern), updater);
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
          .map(({ matcher, updater }) => ({ match: matcher.match(action), updater }))
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
