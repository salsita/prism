import defaultMacher from './matchers/matcher';
import { Mount } from './actions';

import { runSaga } from 'redux-saga';

/**
 * Instantiates and runs Saga
 *
 * @param {Function} Saga implementation
 * @param {Object} State repository for Saga instances
 * @param {Object} Saga subcribers repository for Saga instances
 * @param {String} Action prefix for the Saga instance
 * @param {Function} plain old dispatch function
 */
const instantiateSaga = (
  saga,
  stateRepository,
  subscribersRepository,
  actionPrefix,
  dispatch
) => runSaga(saga(), {
  subscribe: cb => {
    if (!subscribersRepository[actionPrefix]) {
      subscribersRepository[actionPrefix] = []; // eslint-disable-line no-param-reassign
    }

    subscribersRepository[actionPrefix].push(cb);
    return unsubscribing => subscribersRepository[actionPrefix]
      .filter(subscriber => subscriber !== unsubscribing);
  },
  dispatch: action => {
    dispatch({
      ...action,
      type: `${actionPrefix}${action.type}`
    });
  },
  getState: () => stateRepository[actionPrefix]
});


export default class Updater {

  /**
   * @constructor
   * @param {Any} Initial Model
   * @param {Function} Saga Generator function
   * @param {Matcher} Updater specific Matcher implementation
   */
  constructor(initialModel, saga = null, defaultMatcherImpl = defaultMacher) {
    this.initialModel = initialModel;
    this.saga = saga;
    this.defaultMatcherImpl = defaultMatcherImpl;
    this.matchers = [];
  }

  /**
   * Registers updater with corresponding pattern. May optionally provide
   * Matcher implementation
   *
   * @param {String} A pattern to match
   * @param {Function} Updater Function
   * @param {Function} A matcher to be used for matching, optional
   *
   * @return {Updater}
   */
  case(pattern, updater, matcherImpl) {
    const matcher = matcherImpl ? matcherImpl(pattern) : this.defaultMatcherImpl(pattern);
    this.matchers.push({ matcher, updater });

    return this;
  }

  /**
   * Converts Updater to Redux comaptible plain old function
   *
   * @returns {Function} Reducer
   */
  toReducer() {
    const stateRepository = {};
    const subscribersRepository = {};

    return (model = this.initialModel, action, effectExecutor) => {
      // Saga instantiation
      if (action.type === Mount && this.saga) {
        const actionPrefix = action.wrap || '';

        effectExecutor(dispatch => {
          stateRepository[actionPrefix] = model;

          instantiateSaga(
            this.saga,
            stateRepository,
            subscribersRepository,
            actionPrefix,
            dispatch
          );
        });
      }

      if (action) {
        // Matching logic is fairly simple
        // it just maps over all the provided matchers and tries matching the action
        // then only trutrhy matches pass
        return this.matchers
          .map(({ matcher, updater }) => ({ match: matcher(action), updater }))
          .filter(({ match }) => !!match)
          .reduce((partialReduction, { match: { wrap, args, unwrap }, updater }) => {
            const actionPrefix = action.wrap || '';

            // Calling the appropriate updater
            //
            // Effect executor is passed to the Updater so that it can be used
            // for composition
            const reduction = updater(
              partialReduction,
              { ...action, type: unwrap, args, wrap },
              effectExecutor
            );

            // If there is an existing Saga instance for the updater
            // Store reduction into State Repository and notify
            // all subscribers for the specific Saga instance
            if (this.saga) {
              effectExecutor(() => {
                stateRepository[actionPrefix] = reduction;
                subscribersRepository[actionPrefix].forEach(subscriber => subscriber(action));
              });
            }

            return reduction;
          }, model);
      } else {
        return model;
      }
    };
  }

}
