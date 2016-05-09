import { Component, PropTypes } from 'react';
import shallowEqual from 'recompose/shallowEqual';
import createElement from 'recompose/createElement';

import { Mount, Unmount } from './actions';

export default View => class ReduxElmView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  dispatch(...args) {
    this.props.dispatch(...args);
  }

  shouldComponentUpdate(nextProps) {
    return Object
      .keys(this.props)
      .some(prop =>
          (prop !== 'dispatch' && !shallowEqual(this.props[prop], nextProps[prop])));
  }

  componentWillMount() {
    this.dispatch({ type: Mount });
  }

  componentWillUnmount() {
    this.dispatch({ type: Unmount });
  }

  render() {
    return createElement(View, { ...this.props, dispatch: this.dispatch });
  }
};
