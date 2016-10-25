import { Component, PropTypes } from 'react';
import shallowEqual from 'recompose/shallowEqual';
import createEagerElement from 'recompose/createEagerElement';

import { Mount, Unmount } from './actions';

/*
 * HOC implementing shouldComponentUpdate which ignores passed dispatch
 *
 *
 * @return {Component} Wrapped React Component
 */
export default View => class ReduxElmView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  /**
   * @constructor
   * @param {Object} Props
   */
  constructor(props) {
    super(props);
    this.dispatch = ::this.dispatch;
  }

  /**
   * Bound dispatch function
   * @param {...any} args
   */
  dispatch(...args) {
    return this.props.dispatch(...args);
  }

  /**
   * shouldComponentUpdate implementation which ignores `dispatch` passed in props
   *
   * @param {Object} nextProps
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return Object
      .keys(this.props)
      .some(prop =>
          (prop !== 'dispatch' && !shallowEqual(this.props[prop], nextProps[prop])));
  }

  /**
   * Dispatches Mount action
   */
  componentWillMount() {
    this.dispatch({ type: Mount });
  }

  /**
   * Dispatches Unmount action
   */
  componentWillUnmount() {
    this.dispatch({ type: Unmount });
  }

  render() {
    return createEagerElement(View, { ...this.props, dispatch: this.dispatch });
  }
};
