import defaultMacher from './matchers/matcher';

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
const instantiateSaga = (saga, stateRepository, subscribersRepository, actionPrefix, dispatch) => runSaga(saga(), {
  subscribe: cb => {
    if (!subscribersRepository[actionPrefix]) {
      subscribersRepository[actionPrefix] = [];
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
    const sagaInstanceRepository = {};
    const stateRepository = {};
    const subscribersRepository = {};

    return (model = this.initialModel, action, effectExecutor) => {
      if (action) {
        // Matching logic is fairly simple
        // it just maps over all the provided matchers and tries matching the action
        // then only trutrhy matches pass
        return this.matchers
          .map(({ matcher, updater }) => ({ match: matcher(action), updater }))
          .filter(({ match }) => !!match)
          .reduce((partialReduction, { match: { wrap, args, unwrap }, updater }) => {
            const actionPrefix = action.wrap || '';

            // Saga instantiation is wrapped into effectExecutor
            // so that it can be skiped in hot-reload, and
            // it should also be possible to skip passing incoming actions to Saga
            effectExecutor(dispatch => {
              if (this.saga) {
                if (!sagaInstanceRepository[actionPrefix]) {
                  sagaInstanceRepository[actionPrefix] = instantiateSaga(
                    this.saga,
                    stateRepository,
                    subscribersRepository,
                    actionPrefix,
                    dispatch
                  );
                }

                // Notifies all the Saga subscribers about incoming unwrapped action
                subscribersRepository[actionPrefix].forEach(subscriber => subscriber(action));
              }
            });

            // Calling the appropriate updater
            //
            // Effect executor is passed to the Updater so that it can be used
            // for composition
            const reduction = updater(partialReduction, { ...action, type: unwrap, args, wrap }, effectExecutor);

            // Store mutated state snapshot so that Saga
            // instance can later retrieve it
            if (this.saga) {
              stateRepository[actionPrefix] = reduction;
            }

            return reduction;
          }, model);
      } else {
        return model;
      }
    };
  }

}
